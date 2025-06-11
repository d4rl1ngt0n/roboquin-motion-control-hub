
import React from 'react';
import { Badge } from '@/components/ui/badge';

export function RecentActivity() {
  const activities = [
    {
      id: 1,
      type: 'movement',
      message: 'MQ-001 executed preset "Welcome Gesture"',
      time: '2 minutes ago',
      status: 'success'
    },
    {
      id: 2,
      type: 'alert',
      message: 'Low battery warning for MQ-003',
      time: '5 minutes ago',
      status: 'warning'
    },
    {
      id: 3,
      type: 'connection',
      message: 'MQ-002 reconnected to network',
      time: '8 minutes ago',
      status: 'success'
    },
    {
      id: 4,
      type: 'firmware',
      message: 'Firmware update completed for MQ-004',
      time: '15 minutes ago',
      status: 'success'
    },
    {
      id: 5,
      type: 'error',
      message: 'Servo motor fault detected in MQ-005',
      time: '18 minutes ago',
      status: 'error'
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start space-x-3">
          <Badge className={getStatusColor(activity.status)}>
            {activity.type}
          </Badge>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-900">{activity.message}</p>
            <p className="text-xs text-gray-500">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
