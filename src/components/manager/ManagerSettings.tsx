import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

export function ManagerSettings() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              defaultValue={user?.name}
              placeholder="Your name"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              defaultValue={user?.email}
              placeholder="Your email"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="email-notifications">Email Notifications</Label>
            <Switch id="email-notifications" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="client-updates">Client Updates</Label>
            <Switch id="client-updates" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="system-alerts">System Alerts</Label>
            <Switch id="system-alerts" defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Assigned Clients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {user?.assignedClients?.map((clientId) => (
              <div
                key={clientId}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
              >
                <span>{clientId}</span>
                <Button size="sm" variant="outline">
                  View Details
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 