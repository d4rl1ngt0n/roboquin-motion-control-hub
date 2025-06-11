
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Settings, Monitor } from 'lucide-react';
import { DeviceTable } from './DeviceTable';
import { DeviceRegistration } from './DeviceRegistration';

export function DeviceManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showRegistration, setShowRegistration] = useState(false);

  const stats = [
    { label: 'Total Devices', value: '28', color: 'bg-blue-500' },
    { label: 'Online', value: '24', color: 'bg-green-500' },
    { label: 'Offline', value: '3', color: 'bg-red-500' },
    { label: 'Maintenance', value: '1', color: 'bg-yellow-500' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Device Management</h1>
        <p className="text-gray-600">Monitor and manage your IoT mannequin fleet</p>
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

      {/* Controls */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Mannequin Devices</CardTitle>
            <Button onClick={() => setShowRegistration(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Register Device
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by ID, location, or status..."
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

          <DeviceTable searchTerm={searchTerm} />
        </CardContent>
      </Card>

      {showRegistration && (
        <DeviceRegistration onClose={() => setShowRegistration(false)} />
      )}
    </div>
  );
}
