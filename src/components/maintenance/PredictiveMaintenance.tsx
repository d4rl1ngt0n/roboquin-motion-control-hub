import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Wrench, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  DollarSign,
  Shield,
  Activity,
  Zap,
  Settings,
  FileText,
  Brain,
  BarChart3,
  Target,
  TrendingUp,
  AlertCircle,
  Info,
  Star,
  Lock,
  UserCheck,
  CreditCard,
  XCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface MaintenanceIssue {
  id: string;
  robotId: string;
  robotName: string;
  type: 'critical' | 'warning' | 'info';
  component: string;
  description: string;
  severity: number; // 1-10
  estimatedCost?: number;
  estimatedTime?: string;
  detectedAt: Date;
  status: 'pending' | 'client-approval' | 'payment-scheduled' | 'approved' | 'in-progress' | 'resolved';
  aiConfidence: number; // 0-100
  predictedFailureDate?: Date;
  impact: 'high' | 'medium' | 'low';
  clientName: string;
  clientApproval?: {
    approved: boolean;
    approvedAt?: Date;
    approvedBy?: string;
    comments?: string;
  };
  paymentSchedule?: {
    scheduledDate: Date;
    amount: number;
    method: 'invoice' | 'credit-card' | 'bank-transfer';
    status: 'pending' | 'paid' | 'overdue';
  };
  execution?: {
    startDate?: Date;
    completedDate?: Date;
    technician?: string;
    actualCost?: number;
    notes?: string;
  };
}

interface MaintenanceScan {
  id: string;
  status: 'idle' | 'scanning' | 'completed' | 'failed';
  progress: number;
  issues: MaintenanceIssue[];
  lastScan: Date | null;
  nextScan: Date | null;
  totalRobots: number;
  scannedRobots: number;
  scanDuration: number; // in seconds
}

interface Robot {
  id: string;
  name: string;
  location: string;
  clientName: string;
  status: 'online' | 'offline' | 'maintenance';
  lastMaintenance: Date;
  uptime: number;
  healthScore: number;
}

const PredictiveMaintenance: React.FC<{ mannequins?: any[] }> = ({ mannequins }) => {
  const { user } = useAuth();
  const isPro = user && (user as any).isPro;

  // Local state for maintenance scan
  const [maintenanceData, setMaintenanceData] = useState<MaintenanceScan>({
    id: '1',
    status: 'idle',
    progress: 0,
    issues: [],
    lastScan: null,
    nextScan: new Date(Date.now() + 24 * 60 * 60 * 1000),
    totalRobots: 0,
    scannedRobots: 0,
    scanDuration: 0
  });

  // Local fallback robots (for admin/dev)
  const [robots, setRobots] = useState<Robot[]>([
    {
      id: '1',
      name: 'RoboQuin-001',
      location: 'Main Store - Fashion Section',
      clientName: 'Fashion Forward Inc.',
      status: 'online',
      lastMaintenance: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      uptime: 98.5,
      healthScore: 87
    },
    {
      id: '2',
      name: 'RoboQuin-002',
      location: 'Branch Store - Accessories',
      clientName: 'Mall Management Co.',
      status: 'maintenance',
      lastMaintenance: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      uptime: 85.2,
      healthScore: 62
    },
    {
      id: '3',
      name: 'RoboQuin-003',
      location: 'Mall Location - Center Court',
      clientName: 'Luxury Retail Group',
      status: 'online',
      lastMaintenance: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      uptime: 92.1,
      healthScore: 94
    },
    {
      id: '4',
      name: 'RoboQuin-004',
      location: 'VIP Section - Store A',
      clientName: 'Fashion Forward Inc.',
      status: 'online',
      lastMaintenance: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      uptime: 96.8,
      healthScore: 91
    }
  ]);

  // Use mannequins prop if provided, else fallback to local robots
  const filteredRobots = mannequins
    ? mannequins.map(m => ({
        id: m.id,
        name: m.name,
        location: m.location || '',
        clientName: user?.name || '',
        status: m.status,
        lastMaintenance: new Date(),
        uptime: 99,
        healthScore: 90
      }))
    : robots;

  const [isScanning, setIsScanning] = useState(false);
  const [showIssueDialog, setShowIssueDialog] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<MaintenanceIssue | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Determine user role
  const isAdmin = user?.role === 'admin';
  const isClient = user?.role === 'client';

  // Tabs for each role
  const adminTabs = [
    { value: 'overview', label: 'Overview' },
    { value: 'critical', label: `Critical (${maintenanceData.issues.filter(issue => issue.type === 'critical').length})` },
    { value: 'warnings', label: `Warnings (${maintenanceData.issues.filter(issue => issue.type === 'warning').length})` },
    { value: 'info', label: `Info (${maintenanceData.issues.filter(issue => issue.type === 'info').length})` },
    { value: 'workflow', label: 'Workflow' },
  ];
  const clientTabs = [
    { value: 'my-requests', label: 'My Requests' },
    { value: 'approvals', label: 'Approvals' },
    { value: 'payment', label: 'Payment' },
    { value: 'status', label: 'Status' },
    { value: 'workflow', label: 'Workflow' },
  ];

  useEffect(() => {
    setMaintenanceData(prev => ({ ...prev, totalRobots: filteredRobots.length }));
  }, [filteredRobots]);

  const startMaintenanceScan = async () => {
    setIsScanning(true);
    const startTime = Date.now();
    setMaintenanceData(prev => ({ 
      ...prev, 
      status: 'scanning', 
      progress: 0, 
      scannedRobots: 0,
      issues: []
    }));

    // Simulate AI-powered scan for each robot
    const scanSteps = [
      { name: 'System Diagnostics', duration: 1500 },
      { name: 'Motor Performance Analysis', duration: 2000 },
      { name: 'Sensor Calibration Check', duration: 1800 },
      { name: 'Movement Pattern Analysis', duration: 2200 },
      { name: 'Predictive Failure Modeling', duration: 2500 },
      { name: 'AI Risk Assessment', duration: 3000 }
    ];

    for (let robotIndex = 0; robotIndex < filteredRobots.length; robotIndex++) {
      const robot = filteredRobots[robotIndex];
      
      for (let stepIndex = 0; stepIndex < scanSteps.length; stepIndex++) {
        const step = scanSteps[stepIndex];
        await new Promise(resolve => setTimeout(resolve, step.duration));
        
        const overallProgress = ((robotIndex * scanSteps.length + stepIndex + 1) / (filteredRobots.length * scanSteps.length)) * 100;
        setMaintenanceData(prev => ({
          ...prev,
          progress: overallProgress,
          scannedRobots: robotIndex + 1
        }));
      }

      // Generate issues for this robot
      const robotIssues = generateRobotIssues(robot);
      setMaintenanceData(prev => ({
        ...prev,
        issues: [...prev.issues, ...robotIssues]
      }));
    }

    const endTime = Date.now();
    setMaintenanceData(prev => ({
      ...prev,
      status: 'completed',
      progress: 100,
      scannedRobots: filteredRobots.length,
      lastScan: new Date(),
      scanDuration: Math.round((endTime - startTime) / 1000)
    }));

    setIsScanning(false);
  };

  const generateRobotIssues = (robot: Robot): MaintenanceIssue[] => {
    const issues: MaintenanceIssue[] = [];
    // Dramatic demo for user ID:3
    if (user && user.id === '3' && (robot.healthScore < 50 || robot.status === 'maintenance' || robot.status === 'offline')) {
      issues.push({
        id: `${robot.id}-CRITDEMO`,
        robotId: robot.id,
        robotName: robot.name,
        type: 'critical',
        component: 'Core System',
        description: '⚠️ CRITICAL FAILURE: Immediate intervention required! AI has detected a severe malfunction in the core system. Continued operation may result in total shutdown or irreversible damage. Contact support NOW.',
        severity: 10,
        estimatedCost: 500,
        estimatedTime: '6+ hours',
        detectedAt: new Date(),
        status: 'pending',
        aiConfidence: 99,
        predictedFailureDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        impact: 'high',
        clientName: robot.clientName || '',
      });
    }
    // Normal logic for all users
    if (robot.healthScore < 70) {
      issues.push({
        id: `${robot.id}-1`,
        robotId: robot.id,
        robotName: robot.name,
        type: 'critical',
        component: 'Motor System',
        description: `Motor efficiency has decreased by ${100 - robot.healthScore}% over the last 30 days. AI predicts potential failure within 2-3 weeks.`,
        severity: 8,
        estimatedCost: 250,
        estimatedTime: '3-4 hours',
        detectedAt: new Date(),
        status: 'pending',
        aiConfidence: 92,
        predictedFailureDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        impact: 'high',
        clientName: robot.clientName || '',
      });
    }
    if (robot.uptime < 90) {
      issues.push({
        id: `${robot.id}-2`,
        robotId: robot.id,
        robotName: robot.name,
        type: 'warning',
        component: 'Battery System',
        description: `Battery health is at ${robot.uptime}%. Consider replacement within 1-2 months.`,
        severity: 5,
        estimatedCost: 180,
        estimatedTime: '1-2 hours',
        detectedAt: new Date(),
        status: 'pending',
        aiConfidence: 78,
        predictedFailureDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        impact: 'medium',
        clientName: robot.clientName || '',
      });
    }
    if (robot.status === 'maintenance') {
      issues.push({
        id: `${robot.id}-3`,
        robotId: robot.id,
        robotName: robot.name,
        type: 'info',
        component: 'General System',
        description: 'Robot currently under maintenance. All systems functioning normally.',
        severity: 2,
        detectedAt: new Date(),
        status: 'in-progress',
        aiConfidence: 95,
        impact: 'low',
        clientName: robot.clientName || '',
      });
    }
    return issues;
  };

  const approveMaintenance = (issueId: string) => {
    setMaintenanceData(prev => ({
      ...prev,
      issues: prev.issues.map(issue => 
        issue.id === issueId 
          ? { 
              ...issue, 
              status: 'client-approval',
              clientApproval: {
                approved: false,
                approvedAt: undefined,
                approvedBy: undefined,
                comments: ''
              }
            }
          : issue
      )
    }));
  };

  const handleClientApproval = (issueId: string, approved: boolean, comments?: string) => {
    setMaintenanceData(prev => ({
      ...prev,
      issues: prev.issues.map(issue =>
        issue.id === issueId
          ? {
              ...issue,
              status: approved ? 'payment-scheduled' : 'pending',
              clientApproval: {
                approved,
                approvedAt: approved ? new Date() : undefined,
                approvedBy: user?.name || 'Client',
                comments
              },
              paymentSchedule: approved
                ? {
                    scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                    amount: issue.estimatedCost || 100,
                    method: 'invoice',
                    status: 'pending'
                  }
                : undefined
            }
          : issue
      )
    }));
  };

  const handleClientPayment = (issueId: string) => {
    setMaintenanceData(prev => ({
      ...prev,
      issues: prev.issues.map(issue =>
        issue.id === issueId
          ? {
              ...issue,
              status: 'in-progress',
              paymentSchedule: issue.paymentSchedule
                ? { ...issue.paymentSchedule, status: 'paid' }
                : undefined,
              execution: {
                ...issue.execution,
                startDate: new Date(),
                technician: 'Assigned'
              }
            }
          : issue
      )
    }));
  };

  const schedulePayment = (issueId: string, paymentMethod: string, scheduledDate: Date) => {
    setMaintenanceData(prev => ({
      ...prev,
      issues: prev.issues.map(issue => 
        issue.id === issueId 
          ? { 
              ...issue, 
              status: 'approved',
              paymentSchedule: {
                ...issue.paymentSchedule!,
                method: paymentMethod as 'invoice' | 'credit-card' | 'bank-transfer',
                scheduledDate
              }
            }
          : issue
      )
    }));
  };

  const startExecution = (issueId: string, technician: string) => {
    setMaintenanceData(prev => ({
      ...prev,
      issues: prev.issues.map(issue => 
        issue.id === issueId 
          ? { 
              ...issue, 
              status: 'in-progress',
              execution: {
                ...issue.execution,
                startDate: new Date(),
                technician
              }
            }
          : issue
      )
    }));
  };

  const completeExecution = (issueId: string, actualCost: number, notes: string) => {
    setMaintenanceData(prev => ({
      ...prev,
      issues: prev.issues.map(issue => 
        issue.id === issueId 
          ? { 
              ...issue, 
              status: 'resolved',
              execution: {
                ...issue.execution,
                completedDate: new Date(),
                actualCost,
                notes
              }
            }
          : issue
      )
    }));
  };

  const getSeverityColor = (severity: number) => {
    if (severity >= 8) return 'bg-red-100 text-red-800';
    if (severity >= 5) return 'bg-yellow-100 text-yellow-800';
    return 'bg-blue-100 text-blue-800';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'client-approval': return 'bg-orange-100 text-orange-800';
      case 'payment-scheduled': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-purple-100 text-purple-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'client-approval': return <UserCheck className="w-4 h-4" />;
      case 'payment-scheduled': return <CreditCard className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'in-progress': return <Activity className="w-4 h-4" />;
      case 'resolved': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const criticalIssues = maintenanceData.issues.filter(issue => issue.type === 'critical');
  const warningIssues = maintenanceData.issues.filter(issue => issue.type === 'warning');
  const infoIssues = maintenanceData.issues.filter(issue => issue.type === 'info');

  // Helper: filter issues for this client
  const clientIssues = maintenanceData.issues.filter(issue => issue.clientName === user?.name);

  // State for new request modal
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [newRequest, setNewRequest] = useState({
    robotId: '',
    robotName: '',
    component: '',
    description: '',
  });

  // Handler to submit new request
  const handleSubmitNewRequest = () => {
    setMaintenanceData(prev => ({
      ...prev,
      issues: [
        ...prev.issues,
        {
          id: `${Date.now()}`,
          robotId: newRequest.robotId,
          robotName: newRequest.robotName,
          type: 'info',
          component: newRequest.component,
          description: newRequest.description,
          severity: 3,
          detectedAt: new Date(),
          status: 'pending',
          aiConfidence: 0,
          impact: 'low',
          clientName: user?.name || '',
          clientApproval: undefined,
          paymentSchedule: undefined,
          execution: undefined,
          estimatedCost: 0,
        }
      ]
    }));
    setShowNewRequest(false);
    setNewRequest({ robotId: '', robotName: '', component: '', description: '' });
  };

  // Helper: get progress stage for a request
  const getRequestStage = (issue) => {
    if (issue.status === 'pending') return 0;
    if (issue.status === 'client-approval') return 1;
    if (issue.status === 'payment-scheduled' || issue.status === 'approved') return 2;
    if (issue.status === 'in-progress') return 3;
    if (issue.status === 'resolved') return 4;
    return 0;
  };
  const workflowStages = [
    'Submitted',
    'Awaiting Approval',
    'Payment',
    'In Progress',
    'Completed',
  ];

  // State for details modal
  const [showDetails, setShowDetails] = useState(false);
  const [detailsIssue, setDetailsIssue] = useState<MaintenanceIssue | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Predictive Maintenance</h1>
          <p className="text-gray-600">AI-powered device scans and issue detection for your mannequins</p>
        </div>
        <Badge variant="secondary" className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
          <Star className="h-3 w-3 mr-1" />
          Pro Feature
        </Badge>
      </div>
      {!isPro && (
        <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded p-4 mb-4">
          <Lock className="h-5 w-5 text-yellow-600" />
          <span className="text-yellow-800 font-medium">This feature is only accessible to Pro users. Upgrade your plan to unlock predictive maintenance.</span>
        </div>
      )}

      {/* Main Scan Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-600" />
            System-Wide AI Scan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-2">
                Our advanced AI analyzes all {filteredRobots.length} robots in the system to detect potential issues before they become problems.
              </p>
              {maintenanceData.lastScan && (
                <p className="text-xs text-gray-500">
                  Last scan: {maintenanceData.lastScan.toLocaleDateString()} at {maintenanceData.lastScan.toLocaleTimeString()} 
                  (Duration: {maintenanceData.scanDuration}s)
                </p>
              )}
            </div>
            <Button 
              onClick={startMaintenanceScan}
              disabled={isScanning}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isScanning ? (
                <>
                  <Activity className="w-4 h-4 mr-2 animate-spin" />
                  Scanning {maintenanceData.scannedRobots}/{maintenanceData.totalRobots} robots...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  Start AI Scan
                </>
              )}
            </Button>
          </div>

          {isScanning && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Scan Progress</span>
                <span>{Math.round(maintenanceData.progress)}%</span>
              </div>
              <Progress value={maintenanceData.progress} className="w-full" />
              <p className="text-xs text-gray-500">
                Scanned {maintenanceData.scannedRobots} of {maintenanceData.totalRobots} robots
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Tabs */}
      <Tabs key={JSON.stringify(clientIssues)} value={activeTab} onValueChange={setActiveTab}>
        <TabsList className={`grid w-full grid-cols-${(isAdmin ? adminTabs : clientTabs).length}`}>
          {(isAdmin ? adminTabs : clientTabs).map(tab => (
            <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div>
                    <p className="text-sm text-gray-600">Critical Issues</p>
                    <p className="text-2xl font-bold text-red-600">{criticalIssues.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div>
                    <p className="text-sm text-gray-600">Warnings</p>
                    <p className="text-2xl font-bold text-yellow-600">{warningIssues.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600">Info</p>
                    <p className="text-2xl font-bold text-blue-600">{infoIssues.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            {maintenanceData.issues.slice(0, 5).map((issue) => (
              <Card key={issue.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${getSeverityColor(issue.severity)}`}>
                        {issue.type === 'critical' && <AlertTriangle className="w-4 h-4" />}
                        {issue.type === 'warning' && <AlertCircle className="w-4 h-4" />}
                        {issue.type === 'info' && <Info className="w-4 h-4" />}
                      </div>
                      <div>
                        <h3 className="font-semibold">{issue.robotName} - {issue.component}</h3>
                        <p className="text-sm text-gray-600">{issue.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getSeverityColor(issue.severity)}>
                            Severity: {issue.severity}/10
                          </Badge>
                          <Badge className={getImpactColor(issue.impact)}>
                            {issue.impact} impact
                          </Badge>
                          <Badge className="bg-blue-100 text-blue-800">
                            <Brain className="w-3 h-3 mr-1" />
                            AI: {issue.aiConfidence}%
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedIssue(issue);
                          setShowIssueDialog(true);
                        }}
                      >
                        <FileText className="w-4 h-4 mr-1" />
                        Details
                      </Button>
                      {issue.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => approveMaintenance(issue.id)}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="critical" className="mt-6">
          <div className="space-y-4">
            {criticalIssues.map((issue) => (
              <Card key={issue.id} className="border-red-200 bg-red-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-full bg-red-100">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-red-900">{issue.robotName} - {issue.component}</h3>
                        <p className="text-sm text-red-700">{issue.description}</p>
                        {issue.predictedFailureDate && (
                          <p className="text-xs text-red-600 mt-1">
                            Predicted failure: {issue.predictedFailureDate.toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-red-100 text-red-800">
                        AI: {issue.aiConfidence}%
                      </Badge>
                      <Button
                        size="sm"
                        onClick={() => approveMaintenance(issue.id)}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="warnings" className="mt-6">
          <div className="space-y-4">
            {warningIssues.map((issue) => (
              <Card key={issue.id} className="border-yellow-200 bg-yellow-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-full bg-yellow-100">
                        <AlertCircle className="w-4 h-4 text-yellow-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-yellow-900">{issue.robotName} - {issue.component}</h3>
                        <p className="text-sm text-yellow-700">{issue.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-yellow-100 text-yellow-800">
                        AI: {issue.aiConfidence}%
                      </Badge>
                      <Button
                        size="sm"
                        onClick={() => approveMaintenance(issue.id)}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="info" className="mt-6">
          <div className="space-y-4">
            {infoIssues.map((issue) => (
              <Card key={issue.id} className="border-blue-200 bg-blue-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-full bg-blue-100">
                        <Info className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-blue-900">{issue.robotName} - {issue.component}</h3>
                        <p className="text-sm text-blue-700">{issue.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                    <Badge className="bg-blue-100 text-blue-800">
                      AI: {issue.aiConfidence}%
                    </Badge>
                      <Button
                        size="sm"
                        onClick={() => approveMaintenance(issue.id)}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Admin Workflow Tab */}
        {isAdmin && (
          <TabsContent value="workflow" className="mt-6">
            <div className="space-y-6">
              {/* Workflow Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-purple-600" />
                    Enhanced Maintenance Workflow
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                      <div className="w-8 h-8 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-sm font-medium">1</div>
                      <div>
                        <p className="font-medium">Issue Detection</p>
                        <p className="text-sm text-gray-600">AI identifies maintenance needs</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                      <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-medium">2</div>
                      <div>
                        <p className="font-medium">Client Approval</p>
                        <p className="text-sm text-gray-600">Client reviews and approves</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">3</div>
                      <div>
                        <p className="font-medium">Payment Scheduling</p>
                        <p className="text-sm text-gray-600">Payment method and timing</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                      <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium">4</div>
                      <div>
                        <p className="font-medium">Execution</p>
                        <p className="text-sm text-gray-600">Maintenance performed</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Workflow Issues by Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Client Approval Required */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserCheck className="w-5 h-5 text-orange-600" />
                      Awaiting Client Approval
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {maintenanceData.issues.filter(issue => issue.status === 'client-approval').map((issue) => (
                        <div key={issue.id} className="p-3 border border-orange-200 rounded-lg bg-orange-50">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-orange-900">{issue.robotName}</h4>
                            <Badge className="bg-orange-100 text-orange-800">
                              ${issue.estimatedCost?.toFixed(2) || '0.00'}
                            </Badge>
                          </div>
                          <p className="text-sm text-orange-700 mb-2">{issue.description}</p>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleClientApproval(issue.id, true)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleClientApproval(issue.id, false)}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Decline
                            </Button>
                          </div>
                        </div>
                      ))}
                      {maintenanceData.issues.filter(issue => issue.status === 'client-approval').length === 0 && (
                        <p className="text-gray-500 text-center py-4">No issues awaiting client approval</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Scheduled */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                      Payment Scheduled
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {maintenanceData.issues.filter(issue => issue.status === 'payment-scheduled').map((issue) => (
                        <div key={issue.id} className="p-3 border border-blue-200 rounded-lg bg-blue-50">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-blue-900">{issue.robotName}</h4>
                            <Badge className="bg-blue-100 text-blue-800">
                              {issue.paymentSchedule?.method || 'invoice'}
                            </Badge>
                          </div>
                          <p className="text-sm text-blue-700 mb-2">
                            Amount: ${issue.paymentSchedule?.amount.toFixed(2) || '0.00'}
                          </p>
                          <p className="text-xs text-blue-600 mb-2">
                            Due: {issue.paymentSchedule?.scheduledDate.toLocaleDateString()}
                          </p>
                          <Button
                            size="sm"
                            onClick={() => handleClientPayment(issue.id)}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Pay Now
                          </Button>
                        </div>
                      ))}
                      {maintenanceData.issues.filter(issue => issue.status === 'payment-scheduled').length === 0 && (
                        <p className="text-gray-500 text-center py-4">No payments scheduled</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* In Progress and Completed */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* In Progress */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-purple-600" />
                      In Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {maintenanceData.issues.filter(issue => issue.status === 'in-progress').map((issue) => (
                        <div key={issue.id} className="p-3 border border-purple-200 rounded-lg bg-purple-50">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-purple-900">{issue.robotName}</h4>
                            <Badge className="bg-purple-100 text-purple-800">
                              {issue.execution?.technician || 'Unassigned'}
                            </Badge>
                          </div>
                          <p className="text-sm text-purple-700 mb-2">{issue.description}</p>
                          {issue.execution?.startDate && (
                            <p className="text-xs text-purple-600 mb-2">
                              Started: {issue.execution.startDate.toLocaleDateString()}
                            </p>
                          )}
                          <Button
                            size="sm"
                            onClick={() => completeExecution(issue.id, issue.estimatedCost || 0, 'Maintenance completed successfully')}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Mark Complete
                          </Button>
                        </div>
                      ))}
                      {maintenanceData.issues.filter(issue => issue.status === 'in-progress').length === 0 && (
                        <p className="text-gray-500 text-center py-4">No maintenance in progress</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Completed */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      Completed
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {maintenanceData.issues.filter(issue => issue.status === 'resolved').map((issue) => (
                        <div key={issue.id} className="p-3 border border-green-200 rounded-lg bg-green-50">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-green-900">{issue.robotName}</h4>
                            <Badge className="bg-green-100 text-green-800">
                              ${issue.execution?.actualCost?.toFixed(2) || issue.estimatedCost?.toFixed(2) || '0.00'}
                            </Badge>
                          </div>
                          <p className="text-sm text-green-700 mb-2">{issue.description}</p>
                          {issue.execution?.completedDate && (
                            <p className="text-xs text-green-600">
                              Completed: {issue.execution.completedDate.toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      ))}
                      {maintenanceData.issues.filter(issue => issue.status === 'resolved').length === 0 && (
                        <p className="text-gray-500 text-center py-4">No completed maintenance</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        )}

        {/* Client Workflow Tabs */}
        {isClient && (
          <>
            <TabsContent value="my-requests" className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">My Maintenance Requests</h2>
                <Button onClick={() => setShowNewRequest(true)} className="bg-blue-600 text-white">Submit New Request</Button>
              </div>
              {clientIssues.length === 0 ? (
                <p className="text-gray-500">No maintenance requests yet.</p>
              ) : (
                <div className="space-y-3">
                  {clientIssues.map(issue => (
                    <Card key={issue.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">{issue.robotName}</h4>
                            <p className="text-sm text-gray-600">{issue.component}: {issue.description}</p>
                            <p className="text-xs text-gray-400">Status: {issue.status}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
              <Dialog open={showNewRequest} onOpenChange={setShowNewRequest}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Submit Maintenance Request</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3">
                    <Input placeholder="Robot Name" value={newRequest.robotName} onChange={e => setNewRequest(r => ({ ...r, robotName: e.target.value }))} />
                    <Input placeholder="Component" value={newRequest.component} onChange={e => setNewRequest(r => ({ ...r, component: e.target.value }))} />
                    <Textarea placeholder="Describe the issue" value={newRequest.description} onChange={e => setNewRequest(r => ({ ...r, description: e.target.value }))} />
                    <Button onClick={handleSubmitNewRequest} className="bg-blue-600 text-white w-full">Submit</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </TabsContent>
            <TabsContent value="approvals" className="mt-6">
              <h2 className="text-xl font-bold mb-4">Requests Awaiting Your Approval</h2>
              {clientIssues.filter(issue => issue.status === 'client-approval').length === 0 ? (
                <p className="text-gray-500">No requests need your approval.</p>
              ) : (
                <div className="space-y-3">
                  {clientIssues.filter(issue => issue.status === 'client-approval').map(issue => (
                    <Card key={issue.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">{issue.robotName}</h4>
                            <p className="text-sm text-gray-600">{issue.component}: {issue.description}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" className="bg-green-600 text-white" onClick={() => handleClientApproval(issue.id, true)}>Approve</Button>
                            <Button size="sm" variant="outline" onClick={() => handleClientApproval(issue.id, false)}>Decline</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="payment" className="mt-6">
              <h2 className="text-xl font-bold mb-4">Payments</h2>
              {clientIssues.filter(issue => issue.status === 'payment-scheduled' && issue.paymentSchedule?.status === 'pending').length === 0 ? (
                <p className="text-gray-500">No payments due.</p>
              ) : (
                <div className="space-y-3">
                  {clientIssues.filter(issue => issue.status === 'payment-scheduled' && issue.paymentSchedule?.status === 'pending').map(issue => (
                    <Card key={issue.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">{issue.robotName}</h4>
                            <p className="text-sm text-gray-600">Amount: ${issue.paymentSchedule?.amount.toFixed(2)}</p>
                            <p className="text-xs text-gray-400">Due: {issue.paymentSchedule?.scheduledDate.toLocaleDateString()}</p>
                            <p className="text-xs text-gray-400">Status: {issue.paymentSchedule?.status}</p>
                          </div>
                          {issue.paymentSchedule?.status === 'pending' && (
                            <Button size="sm" className="bg-blue-600 text-white" onClick={() => handleClientPayment(issue.id)}>Pay Now</Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="status" className="mt-6">
              <h2 className="text-xl font-bold mb-4">Request Status</h2>
              {clientIssues.length === 0 ? (
                <p className="text-gray-500">No requests to track.</p>
              ) : (
                <div className="space-y-3">
                  {clientIssues.map(issue => (
                    <Card key={issue.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">{issue.robotName}</h4>
                            <p className="text-sm text-gray-600">{issue.component}: {issue.description}</p>
                            <p className="text-xs text-gray-400">Current Status: {issue.status}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="workflow" className="mt-6">
              <h2 className="text-xl font-bold mb-4">Workflow Progress</h2>
              {clientIssues.length === 0 ? (
                <p className="text-gray-500">No requests to show.</p>
              ) : (
                <div className="space-y-6">
                  {clientIssues.map(issue => {
                    const stage = getRequestStage(issue);
                    return (
                      <Card key={issue.id}>
                        <CardContent className="p-4">
                          <div className="mb-2 flex justify-between items-center">
                            <div>
                              <h4 className="font-medium">{issue.robotName}</h4>
                              <p className="text-sm text-gray-600">{issue.component}: {issue.description}</p>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => { setDetailsIssue(issue); setShowDetails(true); }}>Details</Button>
                          </div>
                          <div className="flex items-center justify-between gap-2 mt-4">
                            {workflowStages.map((label, idx) => (
                              <div key={label} className="flex-1 flex flex-col items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${idx < stage ? 'bg-green-500 border-green-500 text-white' : idx === stage ? 'bg-blue-600 border-blue-600 text-white' : 'bg-gray-200 border-gray-300 text-gray-500'}`}>{idx + 1}</div>
                                <span className={`text-xs mt-1 ${idx === stage ? 'font-bold text-blue-700' : 'text-gray-500'}`}>{label}</span>
                                {idx < workflowStages.length - 1 && (
                                  <div className={`h-1 w-full ${idx < stage ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                                )}
                              </div>
                            ))}
                          </div>
                          {/* Action buttons for current stage */}
                          {issue.status === 'client-approval' && (
                            <div className="flex gap-2 mt-4">
                              <Button size="sm" className="bg-green-600 text-white" onClick={() => handleClientApproval(issue.id, true)}>Approve</Button>
                              <Button size="sm" variant="outline" onClick={() => handleClientApproval(issue.id, false)}>Decline</Button>
                            </div>
                          )}
                          {issue.status === 'payment-scheduled' && issue.paymentSchedule?.status === 'pending' && (
                            <div className="flex gap-2 mt-4">
                              <Button size="sm" className="bg-blue-600 text-white" onClick={() => handleClientPayment(issue.id)}>Pay Now</Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
              {/* Details Modal */}
              <Dialog open={showDetails} onOpenChange={setShowDetails}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Request Details</DialogTitle>
                  </DialogHeader>
                  {detailsIssue && (
                    <div className="space-y-2">
                      <div><strong>Robot:</strong> {detailsIssue.robotName}</div>
                      <div><strong>Component:</strong> {detailsIssue.component}</div>
                      <div><strong>Description:</strong> {detailsIssue.description}</div>
                      <div><strong>Status:</strong> {detailsIssue.status}</div>
                      {detailsIssue.estimatedCost !== undefined && <div><strong>Estimated Cost:</strong> ${detailsIssue.estimatedCost}</div>}
                      {detailsIssue.paymentSchedule && (
                        <div>
                          <strong>Payment:</strong> ${detailsIssue.paymentSchedule.amount} ({detailsIssue.paymentSchedule.status})
                        </div>
                      )}
                      {detailsIssue.execution && detailsIssue.execution.technician && (
                        <div><strong>Technician:</strong> {detailsIssue.execution.technician}</div>
                      )}
                      {detailsIssue.execution && detailsIssue.execution.completedDate && (
                        <div><strong>Completed:</strong> {detailsIssue.execution.completedDate.toLocaleDateString()}</div>
                      )}
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </TabsContent>
          </>
        )}
      </Tabs>

      {/* Debug Panel: Show clientIssues and their statuses */}
      <div className="mt-8 p-4 bg-gray-100 rounded text-xs">
        <strong>Debug Panel:</strong>
        <pre>{JSON.stringify(clientIssues.map(i => ({id: i.id, status: i.status, payment: i.paymentSchedule?.status, clientName: i.clientName})), null, 2)}</pre>
      </div>

      {/* Issue Details Dialog */}
      <Dialog open={showIssueDialog} onOpenChange={setShowIssueDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-600" />
              AI Analysis Details
            </DialogTitle>
          </DialogHeader>
          {selectedIssue && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Robot</label>
                  <p className="font-medium">{selectedIssue.robotName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Component</label>
                  <p className="font-medium">{selectedIssue.component}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Severity</label>
                  <Badge className={getSeverityColor(selectedIssue.severity)}>
                    {selectedIssue.severity}/10
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">AI Confidence</label>
                  <Badge className="bg-purple-100 text-purple-800">
                    {selectedIssue.aiConfidence}%
                  </Badge>
                </div>
                {selectedIssue.estimatedCost && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Estimated Cost</label>
                    <p className="font-medium">${selectedIssue.estimatedCost}</p>
                  </div>
                )}
                {selectedIssue.estimatedTime && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Estimated Time</label>
                    <p className="font-medium">{selectedIssue.estimatedTime}</p>
                  </div>
                )}
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">AI Analysis</label>
                <p className="text-sm text-gray-700 mt-1">{selectedIssue.description}</p>
              </div>

              {selectedIssue.predictedFailureDate && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Predicted Failure Date:</strong> {selectedIssue.predictedFailureDate.toLocaleDateString()}
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowIssueDialog(false)}>
                  Close
                </Button>
                {selectedIssue.status === 'pending' && (
                  <Button onClick={() => {
                    approveMaintenance(selectedIssue.id);
                    setShowIssueDialog(false);
                  }}>
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Approve Maintenance
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PredictiveMaintenance; 