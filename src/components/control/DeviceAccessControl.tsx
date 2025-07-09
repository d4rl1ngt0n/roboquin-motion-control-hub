import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { 
  Power, 
  PowerOff, 
  Shield, 
  AlertTriangle, 
  DollarSign,
  Lock,
  Unlock,
  Wifi,
  WifiOff,
  Activity,
  Settings,
  RefreshCw,
  Search,
  Plus,
  Monitor,
  Trash2,
  Edit
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DeviceStatus {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'disabled';
  location: string;
  lastSeen: Date;
  isEnabled: boolean;
  paymentStatus: 'current' | 'overdue' | 'suspended';
  features: {
    movement: boolean;
    dataAccess: boolean;
    remoteControl: boolean;
    maintenance: boolean;
  };
  clientId: string;
  clientName: string;
  registrationDate: Date;
}

interface PaymentInfo {
  amount: number;
  dueDate: Date;
  daysOverdue: number;
  gracePeriod: number;
}

const DeviceAccessControl: React.FC = () => {
  const [devices, setDevices] = useState<DeviceStatus[]>([
    {
      id: '1',
      name: 'RoboQuin-001',
      status: 'online',
      location: 'Main Store - Fashion Section',
      lastSeen: new Date(),
      isEnabled: true,
      paymentStatus: 'current',
      features: {
        movement: true,
        dataAccess: true,
        remoteControl: true,
        maintenance: true
      },
      clientId: 'client1',
      clientName: 'Fashion Forward Inc.',
      registrationDate: new Date('2024-01-15')
    },
    {
      id: '2',
      name: 'RoboQuin-002',
      status: 'disabled',
      location: 'Branch Store - Accessories',
      lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isEnabled: false,
      paymentStatus: 'suspended',
      features: {
        movement: false,
        dataAccess: false,
        remoteControl: false,
        maintenance: false
      },
      clientId: 'client2',
      clientName: 'Mall Management Co.',
      registrationDate: new Date('2024-02-20')
    },
    {
      id: '3',
      name: 'RoboQuin-003',
      status: 'online',
      location: 'Mall Location - Center Court',
      lastSeen: new Date(),
      isEnabled: true,
      paymentStatus: 'current',
      features: {
        movement: true,
        dataAccess: true,
        remoteControl: true,
        maintenance: true
      },
      clientId: 'client3',
      clientName: 'Luxury Retail Group',
      registrationDate: new Date('2024-03-10')
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showKillSwitchDialog, setShowKillSwitchDialog] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<DeviceStatus | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  // Registration form state
  const [registrationForm, setRegistrationForm] = useState({
    name: '',
    location: '',
    clientId: '',
    clientName: '',
    paymentStatus: 'current' as 'current' | 'overdue' | 'suspended',
    features: {
      movement: true,
      dataAccess: true,
      remoteControl: true,
      maintenance: true
    }
  });

  // Mock client data for registration
  const availableClients = [
    { id: 'client1', name: 'Fashion Forward Inc.' },
    { id: 'client2', name: 'Mall Management Co.' },
    { id: 'client3', name: 'Retail Solutions Ltd.' },
    { id: 'client4', name: 'Store Chain Corp.' }
  ];

  const stats = [
    { label: 'Total Devices', value: devices.length.toString(), color: 'bg-blue-500' },
    { label: 'Online', value: devices.filter(d => d.status === 'online').length.toString(), color: 'bg-green-500' },
    { label: 'Disabled', value: devices.filter(d => d.status === 'disabled').length.toString(), color: 'bg-red-500' },
    { label: 'Payment Issues', value: devices.filter(d => d.paymentStatus !== 'current').length.toString(), color: 'bg-yellow-500' },
  ];

  const filteredDevices = devices.filter(device => {
    const matchesSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         device.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         device.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'online') return matchesSearch && device.status === 'online';
    if (activeTab === 'disabled') return matchesSearch && device.status === 'disabled';
    if (activeTab === 'payment-issues') return matchesSearch && device.paymentStatus !== 'current';
    
    return matchesSearch;
  });

  const toggleDeviceAccess = async (deviceId: string, enable: boolean) => {
    setIsProcessing(true);
    
    // Simulate OTA update delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setDevices(prev => prev.map(device => {
      if (device.id === deviceId) {
        return {
          ...device,
          isEnabled: enable,
          status: enable ? 'online' : 'disabled',
          features: {
            movement: enable,
            dataAccess: enable,
            remoteControl: enable,
            maintenance: enable
          }
        };
      }
      return device;
    }));
    
    setIsProcessing(false);
  };

  const enableDevice = (deviceId: string) => {
    toggleDeviceAccess(deviceId, true);
  };

  const disableDevice = (deviceId: string) => {
    setSelectedDevice(devices.find(d => d.id === deviceId) || null);
    setShowKillSwitchDialog(true);
  };

  const confirmKillSwitch = async () => {
    if (!selectedDevice) return;
    
    await toggleDeviceAccess(selectedDevice.id, false);
    setShowKillSwitchDialog(false);
    setSelectedDevice(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-100 text-green-800';
      case 'offline': return 'bg-yellow-100 text-yellow-800';
      case 'disabled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'current': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <Activity className="w-4 h-4" />;
      case 'offline': return <WifiOff className="w-4 h-4" />;
      case 'disabled': return <PowerOff className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  // Note: This function was removed as it references undefined variables
  // const handleSendContact = () => {
  //   toast.success(`Message sent via ${contactForm.method} to client`);
  //   setShowContactClient(false);
  // };

  // Registration handlers
  const handleClientChange = (clientId: string) => {
    const client = availableClients.find(c => c.id === clientId);
    setRegistrationForm(prev => ({
      ...prev,
      clientId,
      clientName: client?.name || ''
    }));
  };

  const handleFeatureToggle = (feature: keyof typeof registrationForm.features) => {
    setRegistrationForm(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [feature]: !prev.features[feature]
      }
    }));
  };

  const handleSubmitRegistration = () => {
    if (!registrationForm.name || !registrationForm.location || !registrationForm.clientId) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newDevice: DeviceStatus = {
      id: `device-${Date.now()}`,
      name: registrationForm.name,
      status: 'online',
      location: registrationForm.location,
      lastSeen: new Date(),
      isEnabled: true,
      paymentStatus: registrationForm.paymentStatus,
      features: registrationForm.features,
      clientId: registrationForm.clientId,
      clientName: registrationForm.clientName,
      registrationDate: new Date()
    };

    setDevices(prev => [...prev, newDevice]);
    
    // Reset form
    setRegistrationForm({
      name: '',
      location: '',
      clientId: '',
      clientName: '',
      paymentStatus: 'current',
      features: {
        movement: true,
        dataAccess: true,
        remoteControl: true,
        maintenance: true
      }
    });
    
    setShowRegistration(false);
    toast.success('Device registered successfully');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Device Control & Management</h2>
          <p className="text-gray-600">Remote device management and payment-based access control</p>
        </div>
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          <Shield className="w-4 h-4 mr-1" />
          Admin Only
        </Badge>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${stat.color}`} />
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Control Interface */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Device Fleet Management</CardTitle>
            <Button onClick={() => setShowRegistration(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Register Device
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by device name, location, or client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Devices</TabsTrigger>
              <TabsTrigger value="online">Online</TabsTrigger>
              <TabsTrigger value="disabled">Disabled</TabsTrigger>
              <TabsTrigger value="payment-issues">Payment Issues</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDevices.map((device) => (
                  <Card key={device.id} className={`${!device.isEnabled ? 'border-red-200 bg-red-50' : ''}`}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{device.name}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(device.status)}>
                            {getStatusIcon(device.status)}
                            {device.status}
                          </Badge>
                          <Badge className={getPaymentStatusColor(device.paymentStatus)}>
                            <DollarSign className="w-3 h-3 mr-1" />
                            {device.paymentStatus}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600">Location</p>
                        <p className="font-medium">{device.location}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Client</p>
                        <p className="font-medium">{device.clientName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Last Seen</p>
                        <p className="font-medium">{device.lastSeen.toLocaleString()}</p>
                      </div>
                      
                      {/* Feature Status */}
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">Features</p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex items-center gap-1">
                            <div className={`w-2 h-2 rounded-full ${device.features.movement ? 'bg-green-500' : 'bg-red-500'}`} />
                            Movement
                          </div>
                          <div className="flex items-center gap-1">
                            <div className={`w-2 h-2 rounded-full ${device.features.dataAccess ? 'bg-green-500' : 'bg-red-500'}`} />
                            Data Access
                          </div>
                          <div className="flex items-center gap-1">
                            <div className={`w-2 h-2 rounded-full ${device.features.remoteControl ? 'bg-green-500' : 'bg-red-500'}`} />
                            Remote Control
                          </div>
                          <div className="flex items-center gap-1">
                            <div className={`w-2 h-2 rounded-full ${device.features.maintenance ? 'bg-green-500' : 'bg-red-500'}`} />
                            Maintenance
                          </div>
                        </div>
                      </div>

                      {/* Control Buttons */}
                      <div className="flex gap-2 pt-2">
                        {device.isEnabled ? (
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => disableDevice(device.id)}
                            disabled={isProcessing}
                            className="flex-1"
                          >
                            <PowerOff className="w-4 h-4 mr-1" />
                            Disable
                          </Button>
                        ) : (
                          <Button 
                            size="sm" 
                            onClick={() => enableDevice(device.id)}
                            disabled={isProcessing}
                            className="flex-1"
                          >
                            <Power className="w-4 h-4 mr-1" />
                            Enable
                          </Button>
                        )}
                        <Button variant="outline" size="sm" onClick={() => {
                          toast.info('Edit device functionality coming soon');
                        }}>
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Kill Switch Confirmation Dialog */}
      <Dialog open={showKillSwitchDialog} onOpenChange={setShowKillSwitchDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Confirm Device Disable
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to disable {selectedDevice?.name}? This will immediately:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Stop all movement and functionality</li>
                <li>Disable remote access and data collection</li>
                <li>Prevent maintenance operations</li>
                <li>Require manual re-enabling</li>
              </ul>
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowKillSwitchDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmKillSwitch}>
              Disable Device
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Device Registration Modal */}
      <Dialog open={showRegistration} onOpenChange={setShowRegistration}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-600" />
              Register New Device
            </DialogTitle>
            <DialogDescription>
              Add a new device to the platform with client assignment and feature configuration
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="device-name">Device Name *</Label>
                <Input
                  id="device-name"
                  value={registrationForm.name}
                  onChange={(e) => setRegistrationForm({ ...registrationForm, name: e.target.value })}
                  placeholder="e.g., RoboQuin-StoreA-01"
                />
              </div>
              <div>
                <Label htmlFor="device-location">Location *</Label>
                <Input
                  id="device-location"
                  value={registrationForm.location}
                  onChange={(e) => setRegistrationForm({ ...registrationForm, location: e.target.value })}
                  placeholder="e.g., Store A - Main Floor"
                />
              </div>
            </div>

            {/* Client Assignment */}
            <div className="space-y-2">
              <Label>Assign to Client *</Label>
              <Select value={registrationForm.clientId} onValueChange={handleClientChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent>
                  {availableClients.map(client => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Payment Status */}
            <div className="space-y-2">
              <Label>Payment Status</Label>
              <Select 
                value={registrationForm.paymentStatus} 
                onValueChange={(value: 'current' | 'overdue' | 'suspended') => 
                  setRegistrationForm({ ...registrationForm, paymentStatus: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">Current</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Feature Configuration */}
            <div className="space-y-3">
              <Label>Enable Features</Label>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="feature-movement"
                    checked={registrationForm.features.movement}
                    onChange={() => handleFeatureToggle('movement')}
                    className="rounded"
                  />
                  <Label htmlFor="feature-movement" className="text-sm">Movement Control</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="feature-data"
                    checked={registrationForm.features.dataAccess}
                    onChange={() => handleFeatureToggle('dataAccess')}
                    className="rounded"
                  />
                  <Label htmlFor="feature-data" className="text-sm">Data Access</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="feature-remote"
                    checked={registrationForm.features.remoteControl}
                    onChange={() => handleFeatureToggle('remoteControl')}
                    className="rounded"
                  />
                  <Label htmlFor="feature-remote" className="text-sm">Remote Control</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="feature-maintenance"
                    checked={registrationForm.features.maintenance}
                    onChange={() => handleFeatureToggle('maintenance')}
                    className="rounded"
                  />
                  <Label htmlFor="feature-maintenance" className="text-sm">Maintenance</Label>
                </div>
              </div>
            </div>

            {/* Summary */}
            {registrationForm.clientName && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Registration Summary</h4>
                <div className="text-sm text-blue-700 space-y-1">
                  <p><strong>Device:</strong> {registrationForm.name || 'Not specified'}</p>
                  <p><strong>Location:</strong> {registrationForm.location || 'Not specified'}</p>
                  <p><strong>Client:</strong> {registrationForm.clientName}</p>
                  <p><strong>Payment Status:</strong> {registrationForm.paymentStatus}</p>
                  <p><strong>Features Enabled:</strong> {Object.values(registrationForm.features).filter(Boolean).length}/4</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowRegistration(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitRegistration} disabled={!registrationForm.name || !registrationForm.location || !registrationForm.clientId}>
                <Plus className="w-4 h-4 mr-2" />
                Register Device
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeviceAccessControl; 