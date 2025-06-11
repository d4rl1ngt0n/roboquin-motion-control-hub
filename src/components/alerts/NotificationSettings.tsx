
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function NotificationSettings() {
  const notificationTypes = [
    { id: 'device-offline', label: 'Device Goes Offline', enabled: true },
    { id: 'low-battery', label: 'Low Battery Warnings', enabled: true },
    { id: 'servo-errors', label: 'Servo Motor Errors', enabled: true },
    { id: 'firmware-updates', label: 'Firmware Update Available', enabled: false },
    { id: 'motion-failures', label: 'Motion Execution Failures', enabled: true },
    { id: 'network-issues', label: 'Network Connectivity Issues', enabled: true },
    { id: 'maintenance-reminders', label: 'Maintenance Reminders', enabled: false },
    { id: 'system-status', label: 'System Status Reports', enabled: false },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {notificationTypes.map((notification) => (
            <div key={notification.id} className="flex items-center justify-between">
              <Label htmlFor={notification.id} className="text-sm font-medium">
                {notification.label}
              </Label>
              <Switch
                id={notification.id}
                defaultChecked={notification.enabled}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@roboquin.com"
              defaultValue="admin@roboquin.com"
            />
          </div>
          
          <div>
            <Label htmlFor="frequency">Digest Frequency</Label>
            <select
              id="frequency"
              className="w-full p-2 border border-gray-300 rounded-md"
              defaultValue="daily"
            >
              <option value="realtime">Real-time</option>
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
          
          <div>
            <Label htmlFor="threshold">Alert Threshold</Label>
            <select
              id="threshold"
              className="w-full p-2 border border-gray-300 rounded-md"
              defaultValue="medium"
            >
              <option value="all">All Alerts</option>
              <option value="medium">Medium & High Only</option>
              <option value="high">High Priority Only</option>
            </select>
          </div>
          
          <Button className="w-full">Save Preferences</Button>
        </CardContent>
      </Card>
    </div>
  );
}
