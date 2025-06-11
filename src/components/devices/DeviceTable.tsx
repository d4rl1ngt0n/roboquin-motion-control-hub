
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Settings, Activity, Database } from 'lucide-react';

interface DeviceTableProps {
  searchTerm: string;
}

export function DeviceTable({ searchTerm }: DeviceTableProps) {
  const devices = [
    {
      id: 'MQ-001',
      name: 'Store A - Window Display',
      location: 'New York Store A',
      customer: 'Fashion Retailer Inc.',
      status: 'online',
      battery: 87,
      firmware: 'v2.3.1',
      lastSeen: '2 min ago',
      ip: '192.168.1.101'
    },
    {
      id: 'MQ-002',
      name: 'Store B - Main Floor',
      location: 'Los Angeles Store B',
      customer: 'Trendy Boutique',
      status: 'online',
      battery: 92,
      firmware: 'v2.3.1',
      lastSeen: '1 min ago',
      ip: '192.168.1.102'
    },
    {
      id: 'MQ-003',
      name: 'Store C - Entrance',
      location: 'Chicago Store C',
      customer: 'Urban Wear Co.',
      status: 'offline',
      battery: 23,
      firmware: 'v2.2.8',
      lastSeen: '2 hours ago',
      ip: '192.168.1.103'
    },
    {
      id: 'MQ-004',
      name: 'Store D - VIP Section',
      location: 'Miami Store D',
      customer: 'Luxury Fashion',
      status: 'online',
      battery: 76,
      firmware: 'v2.3.1',
      lastSeen: '30 sec ago',
      ip: '192.168.1.104'
    },
    {
      id: 'MQ-005',
      name: 'Store E - Seasonal Display',
      location: 'Seattle Store E',
      customer: 'Style Central',
      status: 'maintenance',
      battery: 45,
      firmware: 'v2.1.5',
      lastSeen: '15 min ago',
      ip: '192.168.1.105'
    },
  ];

  const filteredDevices = devices.filter(device =>
    device.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online':
        return <Badge className="bg-green-100 text-green-800">Online</Badge>;
      case 'offline':
        return <Badge className="bg-red-100 text-red-800">Offline</Badge>;
      case 'maintenance':
        return <Badge className="bg-yellow-100 text-yellow-800">Maintenance</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  const getBatteryColor = (battery: number) => {
    if (battery > 60) return 'text-green-600';
    if (battery > 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left p-3 font-semibold">Device ID</th>
            <th className="text-left p-3 font-semibold">Name & Location</th>
            <th className="text-left p-3 font-semibold">Customer</th>
            <th className="text-left p-3 font-semibold">Status</th>
            <th className="text-left p-3 font-semibold">Battery</th>
            <th className="text-left p-3 font-semibold">Firmware</th>
            <th className="text-left p-3 font-semibold">Last Seen</th>
            <th className="text-left p-3 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredDevices.map((device) => (
            <tr key={device.id} className="border-b hover:bg-gray-50">
              <td className="p-3">
                <div className="font-mono font-semibold">{device.id}</div>
                <div className="text-xs text-gray-500">{device.ip}</div>
              </td>
              <td className="p-3">
                <div className="font-medium">{device.name}</div>
                <div className="text-sm text-gray-600">{device.location}</div>
              </td>
              <td className="p-3">
                <div className="text-sm">{device.customer}</div>
              </td>
              <td className="p-3">
                {getStatusBadge(device.status)}
              </td>
              <td className="p-3">
                <span className={getBatteryColor(device.battery)}>
                  {device.battery}%
                </span>
              </td>
              <td className="p-3">
                <span className="font-mono text-sm">{device.firmware}</span>
              </td>
              <td className="p-3">
                <span className="text-sm text-gray-600">{device.lastSeen}</span>
              </td>
              <td className="p-3">
                <div className="flex gap-1">
                  <Button size="sm" variant="outline">
                    <Settings className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Activity className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Database className="h-3 w-3" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
