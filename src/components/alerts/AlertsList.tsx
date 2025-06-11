
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Info, CheckCircle, X } from 'lucide-react';

export function AlertsList() {
  const alerts = [
    {
      id: 1,
      type: 'error',
      title: 'Servo Motor Fault',
      message: 'Left arm servo motor showing resistance anomaly',
      device: 'MQ-005',
      time: '5 minutes ago',
      severity: 'high'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Low Battery',
      message: 'Battery level below 25% threshold',
      device: 'MQ-003',
      time: '2 hours ago',
      severity: 'medium'
    },
    {
      id: 3,
      type: 'info',
      title: 'Firmware Update Available',
      message: 'New firmware version v2.3.2 is available',
      device: 'All Devices',
      time: '4 hours ago',
      severity: 'low'
    },
    {
      id: 4,
      type: 'warning',
      title: 'Network Connectivity',
      message: 'Intermittent connection issues detected',
      device: 'MQ-007',
      time: '6 hours ago',
      severity: 'medium'
    },
    {
      id: 5,
      type: 'error',
      title: 'Motion Execution Failed',
      message: 'Welcome Gesture preset failed to execute',
      device: 'MQ-002',
      time: '8 hours ago',
      severity: 'high'
    },
  ];

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <Info className="h-5 w-5 text-yellow-600" />;
      case 'info':
        return <CheckCircle className="h-5 w-5 text-blue-600" />;
      default:
        return <Info className="h-5 w-5 text-gray-600" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800">Low</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <div key={alert.id} className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              {getAlertIcon(alert.type)}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">{alert.title}</h3>
                  {getSeverityBadge(alert.severity)}
                </div>
                <p className="text-sm text-gray-600 mb-2">{alert.message}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>Device: {alert.device}</span>
                  <span>{alert.time}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                Resolve
              </Button>
              <Button size="sm" variant="outline">
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
