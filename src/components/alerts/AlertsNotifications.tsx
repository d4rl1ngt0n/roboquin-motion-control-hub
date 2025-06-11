
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { AlertsList } from './AlertsList';
import { NotificationSettings } from './NotificationSettings';

export function AlertsNotifications() {
  const [activeTab, setActiveTab] = useState('alerts');

  const alertStats = [
    { label: 'Active Alerts', value: '7', color: 'bg-red-500', icon: AlertTriangle },
    { label: 'Warnings', value: '12', color: 'bg-yellow-500', icon: Info },
    { label: 'Resolved Today', value: '23', color: 'bg-green-500', icon: CheckCircle },
    { label: 'Total Notifications', value: '156', color: 'bg-blue-500', icon: Bell },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Alerts & Notifications</h1>
        <p className="text-gray-600">Monitor system alerts and manage notification preferences</p>
      </div>

      {/* Alert Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {alertStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Card>
        <CardHeader>
          <div className="flex gap-4">
            <Button
              variant={activeTab === 'alerts' ? 'default' : 'outline'}
              onClick={() => setActiveTab('alerts')}
            >
              Active Alerts
            </Button>
            <Button
              variant={activeTab === 'settings' ? 'default' : 'outline'}
              onClick={() => setActiveTab('settings')}
            >
              Notification Settings
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {activeTab === 'alerts' ? <AlertsList /> : <NotificationSettings />}
        </CardContent>
      </Card>
    </div>
  );
}
