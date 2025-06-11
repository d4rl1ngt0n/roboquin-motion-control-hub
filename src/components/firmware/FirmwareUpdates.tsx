
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Upload, Download, CheckCircle, AlertTriangle } from 'lucide-react';

export function FirmwareUpdates() {
  const firmwareVersions = [
    { version: 'v2.3.1', date: '2024-01-15', devices: 24, status: 'stable' },
    { version: 'v2.3.0', date: '2024-01-10', devices: 0, status: 'deprecated' },
    { version: 'v2.2.8', date: '2023-12-20', devices: 1, status: 'legacy' },
    { version: 'v2.1.5', date: '2023-11-15', devices: 1, status: 'legacy' },
  ];

  const updateQueue = [
    { device: 'MQ-003', currentVersion: 'v2.2.8', targetVersion: 'v2.3.1', progress: 0, status: 'queued' },
    { device: 'MQ-005', currentVersion: 'v2.1.5', targetVersion: 'v2.3.1', progress: 0, status: 'queued' },
  ];

  const recentUpdates = [
    { device: 'MQ-001', version: 'v2.3.1', status: 'success', time: '2 hours ago' },
    { device: 'MQ-002', version: 'v2.3.1', status: 'success', time: '3 hours ago' },
    { device: 'MQ-004', version: 'v2.3.1', status: 'success', time: '4 hours ago' },
    { device: 'MQ-006', version: 'v2.3.0', status: 'failed', time: '1 day ago' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'stable': return <Badge className="bg-green-100 text-green-800">Stable</Badge>;
      case 'deprecated': return <Badge className="bg-yellow-100 text-yellow-800">Deprecated</Badge>;
      case 'legacy': return <Badge className="bg-red-100 text-red-800">Legacy</Badge>;
      default: return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  const getUpdateStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <div className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Firmware Management</h1>
        <p className="text-gray-600">Manage OTA firmware updates for your mannequin fleet</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Firmware Versions */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Firmware Versions</CardTitle>
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                Upload New
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {firmwareVersions.map((firmware, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-semibold">{firmware.version}</div>
                    <div className="text-sm text-gray-600">{firmware.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">{firmware.devices} devices</div>
                    {getStatusBadge(firmware.status)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Update Queue */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Update Queue</CardTitle>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Start Updates
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {updateQueue.map((update, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold">{update.device}</span>
                    <Badge variant="outline">Queued</Badge>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    {update.currentVersion} → {update.targetVersion}
                  </div>
                  <Progress value={update.progress} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Updates */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Update History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentUpdates.map((update, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getUpdateStatusIcon(update.status)}
                  <div>
                    <div className="font-semibold">{update.device}</div>
                    <div className="text-sm text-gray-600">Updated to {update.version}</div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">{update.time}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
