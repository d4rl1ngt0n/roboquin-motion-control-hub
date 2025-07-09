import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import AnalyticsChart from './AnalyticsChart';
import Toast from './Toast';
import { Activity, Camera, Square, Play, BarChart3, Users, TrendingUp, Clock, Download, Mail, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';

interface AnalyticsData {
  entries: number;
  exits: number;
  current_people: number;
  timestamp: string;
  mode: string;
}

interface DashboardData {
  current_counts: {
    entries: number;
    exits: number;
    current_people: number;
  };
  hourly_stats: Array<{
    hour: string;
    entries: number;
    exits: number;
  }>;
  peak_hours: Array<{
    hour: string;
    count: number;
  }>;
  avg_dwell_time: string;
  mode: string;
  timestamp: string;
}

const CameraAnalyticsDashboard: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'error' | 'info' } | null>(null);
  const [csvModalOpen, setCsvModalOpen] = useState(false);
  const [csvData, setCsvData] = useState<string | null>(null);
  const [csvLoading, setCsvLoading] = useState(false);
  const [entryLine, setEntryLine] = useState<number>(213);
  const [exitLine, setExitLine] = useState<number>(427);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [draggingLine, setDraggingLine] = useState<'entry' | 'exit' | null>(null);
  const [dragOffset, setDragOffset] = useState(0);

  const API_BASE = 'http://localhost:8000';

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
  };

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch(`${API_BASE}/health`);
        if (response.ok) {
          setIsConnected(true);
          fetchAnalytics();
          fetchDashboard();
        }
      } catch (error) {
        setIsConnected(false);
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isConnected) return;
    const websocket = new WebSocket(`ws://localhost:8000/ws/analytics`);
    websocket.onopen = () => {};
    websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'analytics_update') {
          setAnalyticsData(data.data);
        }
      } catch {}
    };
    websocket.onerror = () => {};
    websocket.onclose = () => {};
    setWs(websocket);
    return () => {
      websocket.close();
    };
  }, [isConnected]);

  // Fetch initial line positions on mount
  useEffect(() => {
    const fetchLinePositions = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/camera/status`);
        if (res.ok) {
          const data = await res.json();
          setEntryLine(data.entry_line_x);
          setExitLine(data.exit_line_x);
        }
      } catch {}
    };
    fetchLinePositions();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/analytics/counts`);
      if (!response.ok) throw new Error('Failed to fetch analytics counts');
      const data = await response.json();
      setAnalyticsData(data);
    } catch (err) {
      console.error('Error fetching analytics counts:', err);
      showToast('Failed to load analytics data', 'error');
    }
  };

  const fetchDashboard = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/analytics/dashboard`);
      if (!response.ok) throw new Error('Failed to fetch dashboard data');
      const data = await response.json();
      setDashboardData(data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      showToast('Failed to load dashboard data', 'error');
    }
  };

  const startCamera = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/camera/start`, { method: 'POST' });
      const data = await response.json();
      if (data.status === 'success') {
        setCameraActive(true);
        fetchAnalytics();
        showToast('Camera started', 'success');
      } else {
        showToast(data.error || 'Failed to start camera', 'error');
      }
    } catch {
      showToast('Error starting camera', 'error');
    }
  };

  const stopCamera = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/camera/stop`, { method: 'POST' });
      const data = await response.json();
      if (data.status === 'success') {
        setCameraActive(false);
        fetchAnalytics();
        showToast('Camera stopped', 'success');
      } else {
        showToast(data.error || 'Failed to stop camera', 'error');
      }
    } catch {
      showToast('Error stopping camera', 'error');
    }
  };

  const generateMockData = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/mock/generate`, { method: 'POST' });
      const data = await res.json();
      fetchAnalytics();
      if (data.status === 'success') {
        showToast(`Mock event: ${data.event_type}`, 'success');
      } else {
        showToast(data.error || 'Failed to generate mock data', 'error');
      }
    } catch {
      showToast('Error generating mock data', 'error');
    }
  };

  const exportCSV = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/analytics/export_csv`);
      if (!res.ok) throw new Error('Failed to export CSV');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'analytics.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      showToast('CSV exported', 'success');
    } catch {
      showToast('Failed to export CSV', 'error');
    }
  };

  const emailCSV = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/analytics/email_csv`, { method: 'POST' });
      const data = await res.json();
      if (data.status === 'success') {
        showToast('CSV emailed (simulated)', 'success');
      } else {
        showToast(data.error || 'Failed to email CSV', 'error');
      }
    } catch {
      showToast('Failed to email CSV', 'error');
    }
  };

  const viewCSV = async () => {
    setCsvLoading(true);
    setCsvModalOpen(true);
    try {
      const res = await fetch(`${API_BASE}/api/analytics/export_csv`);
      if (!res.ok) throw new Error('Failed to fetch CSV');
      const text = await res.text();
      setCsvData(text);
    } catch {
      setCsvData('Failed to load CSV');
    } finally {
      setCsvLoading(false);
    }
  };

  const updateEntryLine = async (value: number) => {
    setEntryLine(value);
    try {
      const res = await fetch(`${API_BASE}/api/camera/entry_line`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value })
      });
      if (!res.ok) throw new Error();
      showToast('Entry line updated', 'success');
    } catch {
      showToast('Failed to update entry line', 'error');
    }
  };

  const updateExitLine = async (value: number) => {
    setExitLine(value);
    try {
      const res = await fetch(`${API_BASE}/api/camera/exit_line`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value })
      });
      if (!res.ok) throw new Error();
      showToast('Exit line updated', 'success');
    } catch {
      showToast('Failed to update exit line', 'error');
    }
  };

  // Calculate percent for overlay
  const videoWidth = 640; // mock width
  const videoHeight = 480; // mock height

  const handleLineMouseDown = (line: 'entry' | 'exit', e: React.MouseEvent) => {
    setDraggingLine(line);
    const containerRect = videoContainerRef.current?.getBoundingClientRect();
    if (containerRect) {
      const mouseX = e.clientX - containerRect.left;
      setDragOffset(line === 'entry' ? mouseX - entryLine : mouseX - exitLine);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!draggingLine) return;
    const containerRect = videoContainerRef.current?.getBoundingClientRect();
    if (!containerRect) return;
    let mouseX = e.clientX - containerRect.left - dragOffset;
    mouseX = Math.max(0, Math.min(videoWidth, mouseX));
    if (draggingLine === 'entry') setEntryLine(Math.round(mouseX));
    if (draggingLine === 'exit') setExitLine(Math.round(mouseX));
  };

  const handleMouseUp = () => {
    if (draggingLine === 'entry') updateEntryLine(entryLine);
    if (draggingLine === 'exit') updateExitLine(exitLine);
    setDraggingLine(null);
  };

  useEffect(() => {
    if (draggingLine) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggingLine, dragOffset, entryLine, exitLine]);

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="flex items-center gap-2">
        <Badge variant={isConnected ? "default" : "destructive"}>
          {isConnected ? "Connected" : "Disconnected"}
        </Badge>
        {cameraActive && (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Camera className="h-3 w-3" />
            Active
          </Badge>
        )}
      </div>

      {/* Camera Feed (Mock) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Camera Feed (Mock)
          </CardTitle>
          <CardDescription>Drag the lines to adjust entry/exit positions</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            ref={videoContainerRef}
            className="relative mx-auto"
            style={{ width: videoWidth, height: videoHeight }}
          >
            {/* Mock video stream: use a placeholder animated GIF or MJPEG URL */}
            <img
              src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif"
              alt="Mock Camera Stream"
              width={videoWidth}
              height={videoHeight}
              className="block w-full h-auto rounded"
              draggable={false}
            />
            {/* Entry Line */}
            <div
              style={{
                position: 'absolute',
                left: entryLine - 2,
                top: 0,
                width: 4,
                height: videoHeight,
                background: 'rgba(34,197,94,0.8)',
                cursor: 'ew-resize',
                zIndex: 10,
              }}
              onMouseDown={e => handleLineMouseDown('entry', e)}
              title="Drag to adjust entry line"
            />
            {/* Exit Line */}
            <div
              style={{
                position: 'absolute',
                left: exitLine - 2,
                top: 0,
                width: 4,
                height: videoHeight,
                background: 'rgba(239,68,68,0.8)',
                cursor: 'ew-resize',
                zIndex: 10,
              }}
              onMouseDown={e => handleLineMouseDown('exit', e)}
              title="Drag to adjust exit line"
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>Entry Line: <span className="font-semibold text-green-600">{entryLine}</span></span>
            <span>Exit Line: <span className="font-semibold text-red-600">{exitLine}</span></span>
          </div>
        </CardContent>
      </Card>

      {/* Camera Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Camera Controls
          </CardTitle>
          <CardDescription>
            Start and stop camera analytics, generate mock data for testing
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button
            onClick={startCamera}
            disabled={cameraActive}
            className="flex items-center gap-2"
          >
            <Play className="h-4 w-4" />
            Start Camera
          </Button>
          <Button
            onClick={stopCamera}
            disabled={!cameraActive}
            variant="destructive"
            className="flex items-center gap-2"
          >
            <Square className="h-4 w-4" />
            Stop Camera
          </Button>
          <Button
            onClick={generateMockData}
            disabled={!cameraActive}
            variant="secondary"
            className="flex items-center gap-2"
          >
            <Activity className="h-4 w-4" />
            Generate Mock Data
          </Button>
        </CardContent>
      </Card>

      {/* Line Positions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Line Positions
          </CardTitle>
          <CardDescription>Adjust entry and exit line positions for analytics</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Entry Line</span>
              <span className="text-xs text-muted-foreground">{entryLine}</span>
            </div>
            <Slider
              min={0}
              max={640}
              step={1}
              value={[entryLine]}
              onValueChange={([v]) => setEntryLine(v)}
              onValueCommit={([v]) => updateEntryLine(v)}
              className="w-full"
            />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Exit Line</span>
              <span className="text-xs text-muted-foreground">{exitLine}</span>
            </div>
            <Slider
              min={0}
              max={640}
              step={1}
              value={[exitLine]}
              onValueChange={([v]) => setExitLine(v)}
              onValueCommit={([v]) => updateExitLine(v)}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Export */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Data Export
          </CardTitle>
          <CardDescription>Export or email analytics data as CSV</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button onClick={exportCSV} className="flex items-center gap-2" variant="outline">
            <Download className="h-4 w-4" /> Export CSV
          </Button>
          <Button onClick={emailCSV} className="flex items-center gap-2" variant="secondary">
            <Mail className="h-4 w-4" /> Email CSV
          </Button>
          <Button onClick={viewCSV} className="flex items-center gap-2" variant="ghost">
            <FileText className="h-4 w-4" /> View CSV
          </Button>
        </CardContent>
      </Card>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Real-time Analytics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Real-time Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analyticsData ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">Entries</span>
                  <span className="text-lg font-semibold text-primary">{analyticsData.entries}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">Exits</span>
                  <span className="text-lg font-semibold text-primary">{analyticsData.exits}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">Current People</span>
                  <span className="text-lg font-semibold text-primary">{analyticsData.current_people}</span>
                </div>
                <div className="pt-2 border-t">
                  <span className="text-xs text-muted-foreground">
                    Last updated: {new Date(analyticsData.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <Activity className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Loading analytics...</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dashboard Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Dashboard Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dashboardData ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">Total Entries</span>
                  <span className="text-lg font-semibold text-primary">{dashboardData.current_counts.entries}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">Total Exits</span>
                  <span className="text-lg font-semibold text-primary">{dashboardData.current_counts.exits}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">Current Occupancy</span>
                  <span className="text-lg font-semibold text-primary">{dashboardData.current_counts.current_people}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">Avg Dwell Time</span>
                  <span className="text-lg font-semibold text-primary">{dashboardData.avg_dwell_time}</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <TrendingUp className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Loading dashboard...</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Peak Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Peak Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dashboardData?.peak_hours ? (
              <div className="space-y-2">
                {dashboardData.peak_hours.slice(0, 3).map((peak, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm font-medium text-muted-foreground">{peak.hour}</span>
                    <span className="text-sm font-semibold text-primary">{peak.count} people</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <Clock className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No peak data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Analytics Chart */}
      {dashboardData?.hourly_stats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Hourly Analytics
            </CardTitle>
            <CardDescription>
              People flow throughout the day
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AnalyticsChart data={dashboardData.hourly_stats} />
          </CardContent>
        </Card>
      )}

      {/* Error Alert */}
      {!isConnected && (
        <Alert variant="destructive">
          <AlertDescription>
            Cannot connect to camera analytics service. Please check if the backend is running.
          </AlertDescription>
        </Alert>
      )}

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* CSV Modal */}
      <Dialog open={csvModalOpen} onOpenChange={setCsvModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>CSV Data</DialogTitle>
            <DialogDescription>Preview of exported analytics CSV</DialogDescription>
          </DialogHeader>
          <div className="overflow-x-auto max-h-96 mt-2">
            {csvLoading ? (
              <span>Loading...</span>
            ) : (
              <pre className="text-xs bg-muted p-2 rounded border overflow-x-auto whitespace-pre-wrap">{csvData}</pre>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CameraAnalyticsDashboard;
