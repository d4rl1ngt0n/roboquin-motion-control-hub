import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { 
  Activity, 
  AlertTriangle, 
  Users, 
  TrendingUp,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  Settings,
  BarChart3,
  Wifi,
  WifiOff,
  Shield,
  Zap,
  Edit,
  Trash2,
  Plus,
  Eye,
  MessageSquare,
  Phone,
  Mail,
  Calendar
} from 'lucide-react';

interface Robot {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'maintenance' | 'disabled';
  location: string;
  lastSeen: Date;
  uptime: number; // percentage
}

interface Issue {
  id: string;
  type: 'critical' | 'warning' | 'info';
  robotId: string;
  robotName: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved';
  priority: 'high' | 'medium' | 'low';
  createdAt: Date;
}

interface SupportRequest {
  id: string;
  robotId: string;
  robotName: string;
  type: 'maintenance' | 'repair' | 'upgrade' | 'emergency';
  status: 'pending' | 'approved' | 'in-progress' | 'completed';
  estimatedCost: number;
  clientName: string;
  createdAt: Date;
}

interface PlatformMetrics {
  totalRobots: number;
  activeRobots: number;
  uptime: number;
  openIssues: number;
  pendingSupport: number;
  maintenanceAlerts: number;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  
  // Modal states
  const [showRobotDetails, setShowRobotDetails] = useState(false);
  const [showIssueDetails, setShowIssueDetails] = useState(false);
  const [showSupportDetails, setShowSupportDetails] = useState(false);
  const [showAddRobot, setShowAddRobot] = useState(false);
  const [showContactClient, setShowContactClient] = useState(false);
  const [showPaymentSettings, setShowPaymentSettings] = useState(false);
  
  // Selected items for modals
  const [selectedRobot, setSelectedRobot] = useState<Robot | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [selectedSupport, setSelectedSupport] = useState<SupportRequest | null>(null);
  
  // Form states
  const [newRobot, setNewRobot] = useState({
    name: '',
    location: '',
    status: 'online' as Robot['status']
  });
  
  const [contactForm, setContactForm] = useState({
    method: 'email',
    subject: '',
    message: ''
  });

  const [robots, setRobots] = useState<Robot[]>([
    {
      id: '1',
      name: 'RoboQuin-001',
      status: 'online',
      location: 'Main Store - Fashion Section',
      lastSeen: new Date(),
      uptime: 98.5
    },
    {
      id: '2',
      name: 'RoboQuin-002',
      status: 'maintenance',
      location: 'Branch Store - Accessories',
      lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000),
      uptime: 85.2
    },
    {
      id: '3',
      name: 'RoboQuin-003',
      status: 'offline',
      location: 'Mall Location - Center Court',
      lastSeen: new Date(Date.now() - 6 * 60 * 60 * 1000),
      uptime: 92.1
    }
  ]);

  const [issues, setIssues] = useState<Issue[]>([
    {
      id: '1',
      type: 'critical',
      robotId: '2',
      robotName: 'RoboQuin-002',
      description: 'Motor failure detected in left hip joint',
      status: 'in-progress',
      priority: 'high',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: '2',
      type: 'warning',
      robotId: '3',
      robotName: 'RoboQuin-003',
      description: 'Battery health below 20%',
      status: 'open',
      priority: 'medium',
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000)
    }
  ]);

  const [supportRequests, setSupportRequests] = useState<SupportRequest[]>([
    {
      id: '1',
      robotId: '2',
      robotName: 'RoboQuin-002',
      type: 'repair',
      status: 'approved',
      estimatedCost: 450.00,
      clientName: 'Fashion Forward Inc.',
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
    },
    {
      id: '2',
      robotId: '3',
      robotName: 'RoboQuin-003',
      type: 'maintenance',
      status: 'pending',
      estimatedCost: 150.00,
      clientName: 'Mall Management Co.',
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000)
    }
  ]);

  const [metrics, setMetrics] = useState<PlatformMetrics>({
    totalRobots: 3,
    activeRobots: 1,
    uptime: 91.9,
    openIssues: 2,
    pendingSupport: 1,
    maintenanceAlerts: 3
  });

  // Handler functions
  const handleRobotSettings = (robot: Robot) => {
    setSelectedRobot(robot);
    setShowRobotDetails(true);
  };

  const handleViewIssue = (issue: Issue) => {
    setSelectedIssue(issue);
    setShowIssueDetails(true);
  };

  const handleViewSupport = (support: SupportRequest) => {
    setSelectedSupport(support);
    setShowSupportDetails(true);
  };

  const handleAddRobot = () => {
    setShowAddRobot(true);
  };

  const handleSubmitNewRobot = () => {
    if (!newRobot.name || !newRobot.location) {
      toast.error('Please fill in all required fields');
      return;
    }

    const robot: Robot = {
      id: Date.now().toString(),
      name: newRobot.name,
      status: newRobot.status,
      location: newRobot.location,
      lastSeen: new Date(),
      uptime: 100
    };

    setRobots(prev => [...prev, robot]);
    setMetrics(prev => ({
      ...prev,
      totalRobots: prev.totalRobots + 1,
      activeRobots: prev.activeRobots + (newRobot.status === 'online' ? 1 : 0)
    }));

    setNewRobot({ name: '', location: '', status: 'online' });
    setShowAddRobot(false);
    toast.success('Robot added successfully');
  };

  const handleUpdateRobotStatus = (robotId: string, newStatus: Robot['status']) => {
    setRobots(prev => prev.map(robot => 
      robot.id === robotId ? { ...robot, status: newStatus } : robot
    ));
    
    setMetrics(prev => ({
      ...prev,
      activeRobots: robots.filter(r => r.status === 'online').length
    }));
    
    toast.success(`Robot status updated to ${newStatus}`);
  };

  const handleUpdateIssueStatus = (issueId: string, newStatus: Issue['status']) => {
    setIssues(prev => prev.map(issue => 
      issue.id === issueId ? { ...issue, status: newStatus } : issue
    ));
    
    setMetrics(prev => ({
      ...prev,
      openIssues: issues.filter(i => i.status !== 'resolved').length
    }));
    
    toast.success(`Issue status updated to ${newStatus}`);
  };

  const handleUpdateSupportStatus = (supportId: string, newStatus: SupportRequest['status']) => {
    setSupportRequests(prev => prev.map(support => 
      support.id === supportId ? { ...support, status: newStatus } : support
    ));
    
    setMetrics(prev => ({
      ...prev,
      pendingSupport: supportRequests.filter(s => s.status === 'pending').length
    }));
    
    toast.success(`Support request status updated to ${newStatus}`);
  };

  const handleContactClient = (support: SupportRequest) => {
    setSelectedSupport(support);
    setContactForm({
      method: 'email',
      subject: `Re: ${support.type} request for ${support.robotName}`,
      message: `Dear ${support.clientName},\n\nThank you for your ${support.type} request for ${support.robotName}. We are currently reviewing your request and will get back to you shortly.\n\nBest regards,\nRoboQuin Support Team`
    });
    setShowContactClient(true);
  };

  const handleSendContact = () => {
    toast.success(`Message sent via ${contactForm.method} to client`);
    setShowContactClient(false);
  };

  const handleDeleteRobot = (robotId: string) => {
    setRobots(prev => prev.filter(robot => robot.id !== robotId));
    setMetrics(prev => ({
      ...prev,
      totalRobots: prev.totalRobots - 1,
      activeRobots: robots.filter(r => r.status === 'online').length
    }));
    toast.success('Robot removed from system');
  };

  const handlePaymentSettings = () => {
    setShowPaymentSettings(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-100 text-green-800';
      case 'offline': return 'bg-red-100 text-red-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'disabled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <Wifi className="w-4 h-4" />;
      case 'offline': return <WifiOff className="w-4 h-4" />;
      case 'maintenance': return <Settings className="w-4 h-4" />;
      case 'disabled': return <XCircle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Platform overview and management</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            <Shield className="w-4 h-4 mr-1" />
            Admin Access
          </Badge>
          {/* Payment Settings button removed as requested */}
        </div>
      </div>

      {/* Support Requests - Priority Section */}
      <Card className="border-2 border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Users className="w-6 h-6 text-blue-600" />
            Support Requests - Priority Check
            <Badge className="bg-blue-600 text-white ml-2">
              {supportRequests.filter(s => s.status === 'pending').length} Pending
            </Badge>
          </CardTitle>
          <p className="text-sm text-blue-700">Critical support requests requiring immediate attention</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {supportRequests.filter(request => request.status === 'pending').map((request) => (
              <div key={request.id} className="p-4 border border-blue-200 rounded-lg bg-white">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-sm">{request.robotName}</h4>
                      <Badge className="bg-red-100 text-red-800 border-red-200">
                        {request.status}
                      </Badge>
                      <Badge variant="outline" className="border-blue-300 text-blue-700">
                        {request.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 font-medium">{request.clientName}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-600 mt-2">
                      <span className="font-medium">Est. Cost: ${request.estimatedCost}</span>
                      <span>{request.createdAt.toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Button 
                    variant="default" 
                    size="sm" 
                    onClick={() => handleViewSupport(request)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Review Now
                  </Button>
                </div>
              </div>
            ))}
            {supportRequests.filter(request => request.status === 'pending').length === 0 && (
              <div className="text-center py-6 text-blue-600">
                <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                <p className="font-medium">No pending support requests</p>
                <p className="text-sm">All support requests have been addressed</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Robots</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeRobots}/{metrics.totalRobots}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((metrics.activeRobots / metrics.totalRobots) * 100)}% operational
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Uptime</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.uptime}%</div>
            <Progress value={metrics.uptime} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.openIssues}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.maintenanceAlerts} maintenance alerts
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Active Robots Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Active Robots Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {robots.map((robot) => (
              <div key={robot.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(robot.status)}>
                      {getStatusIcon(robot.status)}
                      {robot.status}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="font-medium">{robot.name}</h4>
                    <p className="text-sm text-gray-600">{robot.location}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <div className="font-medium">{robot.uptime}%</div>
                    <div className="text-gray-500">Uptime</div>
                  </div>

                  <div className="text-center">
                    <div className="font-medium">{robot.lastSeen.toLocaleTimeString()}</div>
                    <div className="text-gray-500">Last Seen</div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleRobotSettings(robot)}>
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

        {/* Open Issues */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              Open Issues ({issues.filter(i => i.status !== 'resolved').length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {issues.filter(issue => issue.status !== 'resolved').map((issue) => (
                <div key={issue.id} className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm">{issue.robotName}</h4>
                        <Badge className={getPriorityColor(issue.priority)}>
                          {issue.priority}
                        </Badge>
                        <Badge className={getStatusColor(issue.status)}>
                          {issue.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{issue.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {issue.createdAt.toLocaleString()}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleViewIssue(issue)}>
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Quick Actions</CardTitle>
            <Button onClick={handleAddRobot} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Robot
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Button variant="outline" className="h-20 flex-col" onClick={() => navigate('/dashboard/maintenance')}>
              <Settings className="w-6 h-6 mb-2" />
              <span className="text-sm">Maintenance</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col" onClick={() => navigate('/dashboard/device-control')}>
              <Shield className="w-6 h-6 mb-2" />
              <span className="text-sm">Access Control</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col" onClick={() => navigate('/dashboard/analytics')}>
              <BarChart3 className="w-6 h-6 mb-2" />
              <span className="text-sm">Analytics</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col" onClick={() => navigate('/dashboard/analytics')}>
              <Zap className="w-6 h-6 mb-2" />
              <span className="text-sm">System Health</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Robot Details Modal */}
      <Dialog open={showRobotDetails} onOpenChange={setShowRobotDetails}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Robot Details - {selectedRobot?.name}</DialogTitle>
            <DialogDescription>
              Manage robot settings and status
            </DialogDescription>
          </DialogHeader>
          {selectedRobot && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Robot Name</Label>
                  <Input value={selectedRobot.name} readOnly />
                </div>
                <div>
                  <Label>Location</Label>
                  <Input value={selectedRobot.location} readOnly />
                </div>
                <div>
                  <Label>Current Status</Label>
                  <Select value={selectedRobot.status} onValueChange={(value: Robot['status']) => handleUpdateRobotStatus(selectedRobot.id, value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="offline">Offline</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="disabled">Disabled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Uptime</Label>
                  <Input value={`${selectedRobot.uptime}%`} readOnly />
                </div>

                <div>
                  <Label>Last Seen</Label>
                  <Input value={selectedRobot.lastSeen.toLocaleString()} readOnly />
                </div>
              </div>
              
              <div className="flex gap-2 justify-end">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove Robot
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remove Robot</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to remove {selectedRobot.name} from the system? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteRobot(selectedRobot.id)}>
                        Remove
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <Button variant="outline" onClick={() => setShowRobotDetails(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Issue Details Modal */}
      <Dialog open={showIssueDetails} onOpenChange={setShowIssueDetails}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Issue Details</DialogTitle>
            <DialogDescription>
              Review and update issue status
            </DialogDescription>
          </DialogHeader>
          {selectedIssue && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Robot</Label>
                  <Input value={selectedIssue.robotName} readOnly />
                </div>
                <div>
                  <Label>Type</Label>
                  <Input value={selectedIssue.type} readOnly />
                </div>
                <div>
                  <Label>Priority</Label>
                  <Input value={selectedIssue.priority} readOnly />
                </div>
                <div>
                  <Label>Status</Label>
                  <Select value={selectedIssue.status} onValueChange={(value: Issue['status']) => handleUpdateIssueStatus(selectedIssue.id, value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label>Description</Label>
                <Textarea value={selectedIssue.description} readOnly rows={3} />
              </div>
              
              <div>
                <Label>Created</Label>
                <Input value={selectedIssue.createdAt.toLocaleString()} readOnly />
              </div>
              
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowIssueDetails(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Support Request Details Modal */}
      <Dialog open={showSupportDetails} onOpenChange={setShowSupportDetails}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Support Request Details</DialogTitle>
            <DialogDescription>
              Review and manage support request
            </DialogDescription>
          </DialogHeader>
          {selectedSupport && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Robot</Label>
                  <Input value={selectedSupport.robotName} readOnly />
                </div>
                <div>
                  <Label>Client</Label>
                  <Input value={selectedSupport.clientName} readOnly />
                </div>
                <div>
                  <Label>Type</Label>
                  <Input value={selectedSupport.type} readOnly />
                </div>
                <div>
                  <Label>Status</Label>
                  <Select value={selectedSupport.status} onValueChange={(value: SupportRequest['status']) => handleUpdateSupportStatus(selectedSupport.id, value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Estimated Cost</Label>
                  <Input value={`$${selectedSupport.estimatedCost.toFixed(2)}`} readOnly />
                </div>
                <div>
                  <Label>Created</Label>
                  <Input value={selectedSupport.createdAt.toLocaleString()} readOnly />
                </div>
              </div>
              
              <div className="flex gap-2 justify-end">
                <Button onClick={() => handleContactClient(selectedSupport)}>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Contact Client
                </Button>
                <Button variant="outline" onClick={() => setShowSupportDetails(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Robot Modal */}
      <Dialog open={showAddRobot} onOpenChange={setShowAddRobot}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Robot</DialogTitle>
            <DialogDescription>
              Register a new robot to the platform
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="robot-name">Robot Name</Label>
              <Input
                id="robot-name"
                value={newRobot.name}
                onChange={(e) => setNewRobot({ ...newRobot, name: e.target.value })}
                placeholder="e.g., RoboQuin-004"
              />
            </div>
            <div>
              <Label htmlFor="robot-location">Location</Label>
              <Input
                id="robot-location"
                value={newRobot.location}
                onChange={(e) => setNewRobot({ ...newRobot, location: e.target.value })}
                placeholder="e.g., Store A - Main Floor"
              />
            </div>
            <div>
              <Label htmlFor="robot-status">Initial Status</Label>
              <Select value={newRobot.status} onValueChange={(value: Robot['status']) => setNewRobot({ ...newRobot, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="disabled">Disabled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowAddRobot(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitNewRobot}>
                Add Robot
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Contact Client Modal */}
      <Dialog open={showContactClient} onOpenChange={setShowContactClient}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Contact Client</DialogTitle>
            <DialogDescription>
              Send a message to {selectedSupport?.clientName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Contact Method</Label>
              <Select value={contactForm.method} onValueChange={(value) => setContactForm({ ...contactForm, method: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Subject</Label>
              <Input
                value={contactForm.subject}
                onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
              />
            </div>
            <div>
              <Label>Message</Label>
              <Textarea
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                rows={6}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowContactClient(false)}>
                Cancel
              </Button>
              <Button onClick={handleSendContact}>
                <Mail className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard; 