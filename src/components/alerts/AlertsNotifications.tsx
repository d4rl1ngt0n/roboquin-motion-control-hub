import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Info, 
  Settings, 
  Filter,
  Search,
  Clock,
  MapPin,
  User,
  Zap,
  Shield,
  Wifi,
  WifiOff,
  Settings as SettingsIcon,
  Trash2,
  Eye,
  EyeOff,
  Volume2,
  VolumeX
} from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Alert {
  id: string;
  title: string;
  message: string;
  type: 'error' | 'warning' | 'info' | 'success';
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'system' | 'maintenance' | 'security' | 'performance' | 'billing';
  mannequinId?: string;
  mannequinName?: string;
  timestamp: Date;
  isRead: boolean;
  isAcknowledged: boolean;
  location?: string;
  assignedTo?: string;
}

interface NotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
  inApp: boolean;
  criticalAlerts: boolean;
  maintenanceAlerts: boolean;
  performanceAlerts: boolean;
  securityAlerts: boolean;
  billingAlerts: boolean;
  quietHours: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
}

interface AlertsNotificationsProps {}

export function AlertsNotifications({}: AlertsNotificationsProps) {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      title: 'Mannequin Offline',
      message: 'MQ-001 has been offline for more than 30 minutes',
      type: 'error',
      severity: 'high',
      category: 'system',
      mannequinId: 'MQ-001',
      mannequinName: 'Store A - Window Display',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      isRead: false,
      isAcknowledged: false,
      location: 'Store A'
    },
    {
      id: '2',
      title: 'Maintenance Due',
      message: 'MQ-002 requires scheduled maintenance within 48 hours',
      type: 'warning',
      severity: 'medium',
      category: 'maintenance',
      mannequinId: 'MQ-002',
      mannequinName: 'Store A - Main Floor',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isRead: true,
      isAcknowledged: false,
      location: 'Store A'
    },
    {
      id: '3',
      title: 'Performance Alert',
      message: 'MQ-004 showing reduced engagement metrics',
      type: 'info',
      severity: 'low',
      category: 'performance',
      mannequinId: 'MQ-004',
      mannequinName: 'Store D - VIP Section',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      isRead: true,
      isAcknowledged: true,
      location: 'Store D'
    },
    {
      id: '4',
      title: 'Security Alert',
      message: 'Unauthorized access attempt detected on MQ-003',
      type: 'error',
      severity: 'critical',
      category: 'security',
      mannequinId: 'MQ-003',
      mannequinName: 'Store B - Entrance',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      isRead: false,
      isAcknowledged: false,
      location: 'Store B'
    },
    {
      id: '5',
      title: 'Billing Reminder',
      message: 'Your premium subscription will renew in 7 days',
      type: 'info',
      severity: 'low',
      category: 'billing',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      isRead: true,
      isAcknowledged: false
    }
  ]);

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    email: true,
    sms: false,
    push: true,
    inApp: true,
    criticalAlerts: true,
    maintenanceAlerts: true,
    performanceAlerts: false,
    securityAlerts: true,
    billingAlerts: false,
    quietHours: false,
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00'
  });

  const [filters, setFilters] = useState({
    type: 'all',
    severity: 'all',
    category: 'all',
    status: 'all',
    search: ''
  });

  const [activeTab, setActiveTab] = useState('alerts');

  // Filter alerts based on current filters
  const filteredAlerts = alerts.filter(alert => {
    if (filters.type !== 'all' && alert.type !== filters.type) return false;
    if (filters.severity !== 'all' && alert.severity !== filters.severity) return false;
    if (filters.category !== 'all' && alert.category !== filters.category) return false;
    if (filters.status === 'unread' && alert.isRead) return false;
    if (filters.status === 'unacknowledged' && alert.isAcknowledged) return false;
    if (filters.search && !alert.title.toLowerCase().includes(filters.search.toLowerCase()) && 
        !alert.message.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  const unreadCount = alerts.filter(alert => !alert.isRead).length;
  const criticalCount = alerts.filter(alert => alert.severity === 'critical' && !alert.isAcknowledged).length;

  const handleMarkAsRead = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, isRead: true } : alert
    ));
    toast.success('Alert marked as read');
  };

  const handleAcknowledge = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, isAcknowledged: true } : alert
    ));
    toast.success('Alert acknowledged');
  };

  const handleDeleteAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    toast.success('Alert deleted');
  };

  const handleMarkAllAsRead = () => {
    setAlerts(prev => prev.map(alert => ({ ...alert, isRead: true })));
    toast.success('All alerts marked as read');
  };

  const handleClearAll = () => {
    setAlerts([]);
    toast.success('All alerts cleared');
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge className="bg-red-500">Critical</Badge>;
      case 'high':
        return <Badge className="bg-orange-500">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500">Medium</Badge>;
      case 'low':
        return <Badge className="bg-blue-500">Low</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'system':
        return <Zap className="h-4 w-4" />;
      case 'maintenance':
        return <SettingsIcon className="h-4 w-4" />;
      case 'security':
        return <Shield className="h-4 w-4" />;
      case 'performance':
        return <Wifi className="h-4 w-4" />;
      case 'billing':
        return <Bell className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Alerts & Notifications</h1>
          <p className="text-gray-600">Manage system alerts and notification preferences</p>
        </div>
        <div className="flex items-center gap-2">
          {criticalCount > 0 && (
            <Badge className="bg-red-500">
              {criticalCount} Critical
            </Badge>
          )}
          {unreadCount > 0 && (
            <Badge variant="outline">
              {unreadCount} Unread
            </Badge>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="alerts" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Alerts ({alerts.length})
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Notification Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <Label>Search</Label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search alerts..."
                      value={filters.search}
                      onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                      className="pl-8"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={filters.type} onValueChange={(value) => setFilters({ ...filters, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="success">Success</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Severity</Label>
                  <Select value={filters.severity} onValueChange={(value) => setFilters({ ...filters, severity: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Severities</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={filters.category} onValueChange={(value) => setFilters({ ...filters, category: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                      <SelectItem value="performance">Performance</SelectItem>
                      <SelectItem value="billing">Billing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="unread">Unread</SelectItem>
                      <SelectItem value="unacknowledged">Unacknowledged</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleMarkAllAsRead}>
                Mark All as Read
              </Button>
              <Button variant="outline" onClick={handleClearAll}>
                Clear All
              </Button>
            </div>
            <div className="text-sm text-gray-600">
              Showing {filteredAlerts.length} of {alerts.length} alerts
            </div>
      </div>

          {/* Alerts List */}
          <div className="space-y-4">
            {filteredAlerts.map((alert) => (
              <Card key={alert.id} className={`${!alert.isRead ? 'border-l-4 border-l-blue-500 bg-blue-50' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {getAlertIcon(alert.type)}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{alert.title}</h3>
                          {getSeverityBadge(alert.severity)}
                          {!alert.isRead && (
                            <Badge variant="outline" className="bg-blue-100 text-blue-700">
                              New
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-600">{alert.message}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTimeAgo(alert.timestamp)}
                          </div>
                          {alert.mannequinName && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {alert.mannequinName}
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            {getCategoryIcon(alert.category)}
                            {alert.category}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!alert.isRead && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMarkAsRead(alert.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      {!alert.isAcknowledged && (
            <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAcknowledge(alert.id)}
            >
                          <CheckCircle className="h-4 w-4" />
            </Button>
                      )}
            <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteAlert(alert.id)}
            >
                        <Trash2 className="h-4 w-4" />
            </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredAlerts.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No alerts found</h3>
                  <p className="text-gray-600">No alerts match your current filters.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Notification Channels
              </CardTitle>
        </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Delivery Methods</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-gray-600">Receive notifications via email</p>
                    </div>
                    <Switch
                      checked={notificationSettings.email}
                      onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, email: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>SMS Notifications</Label>
                      <p className="text-sm text-gray-600">Receive notifications via SMS</p>
                    </div>
                    <Switch
                      checked={notificationSettings.sms}
                      onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, sms: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-gray-600">Receive notifications in the app</p>
                    </div>
                    <Switch
                      checked={notificationSettings.push}
                      onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, push: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>In-App Notifications</Label>
                      <p className="text-sm text-gray-600">Show notifications within the application</p>
                    </div>
                    <Switch
                      checked={notificationSettings.inApp}
                      onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, inApp: checked })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Alert Types</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Critical Alerts</Label>
                      <p className="text-sm text-gray-600">System failures and security breaches</p>
                    </div>
                    <Switch
                      checked={notificationSettings.criticalAlerts}
                      onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, criticalAlerts: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Maintenance Alerts</Label>
                      <p className="text-sm text-gray-600">Scheduled maintenance and repairs</p>
                    </div>
                    <Switch
                      checked={notificationSettings.maintenanceAlerts}
                      onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, maintenanceAlerts: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Performance Alerts</Label>
                      <p className="text-sm text-gray-600">Performance metrics and optimizations</p>
                    </div>
                    <Switch
                      checked={notificationSettings.performanceAlerts}
                      onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, performanceAlerts: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Security Alerts</Label>
                      <p className="text-sm text-gray-600">Security events and access attempts</p>
                    </div>
                    <Switch
                      checked={notificationSettings.securityAlerts}
                      onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, securityAlerts: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Billing Alerts</Label>
                      <p className="text-sm text-gray-600">Payment reminders and subscription updates</p>
                    </div>
                    <Switch
                      checked={notificationSettings.billingAlerts}
                      onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, billingAlerts: checked })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Quiet Hours</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Enable Quiet Hours</Label>
                      <p className="text-sm text-gray-600">Pause non-critical notifications during specified hours</p>
                    </div>
                    <Switch
                      checked={notificationSettings.quietHours}
                      onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, quietHours: checked })}
                    />
                  </div>
                  {notificationSettings.quietHours && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Start Time</Label>
                        <Input
                          type="time"
                          value={notificationSettings.quietHoursStart}
                          onChange={(e) => setNotificationSettings({ ...notificationSettings, quietHoursStart: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>End Time</Label>
                        <Input
                          type="time"
                          value={notificationSettings.quietHoursEnd}
                          onChange={(e) => setNotificationSettings({ ...notificationSettings, quietHoursEnd: e.target.value })}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Button 
                className="flex items-center gap-2"
                onClick={() => {
                  toast.success('Notification settings saved successfully');
                }}
              >
                <Settings className="h-4 w-4" />
                Save Settings
              </Button>
        </CardContent>
      </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
