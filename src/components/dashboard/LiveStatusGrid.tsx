import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export interface LiveStatusMannequin {
  id: string;
  name: string;
  status: string;
  battery?: number;
  lastSeen?: string;
  store?: string;
  clientId?: string;
}

interface LiveStatusGridProps {
  mannequins?: LiveStatusMannequin[];
  onViewDetails?: (mannequin: LiveStatusMannequin) => void;
}

export function LiveStatusGrid({ mannequins: mannequinsProp, onViewDetails }: LiveStatusGridProps) {
  const defaultMannequins = [
    { id: 'MQ-001', name: 'Store A - Window Display', status: 'online', battery: 87, lastSeen: '2 min ago' },
    { id: 'MQ-002', name: 'Store B - Main Floor', status: 'online', battery: 92, lastSeen: '1 min ago' },
    { id: 'MQ-003', name: 'Store C - Entrance', status: 'offline', battery: 23, lastSeen: '2 hours ago' },
    { id: 'MQ-004', name: 'Store D - VIP Section', status: 'online', battery: 76, lastSeen: '30 sec ago' },
    { id: 'MQ-005', name: 'Store E - Seasonal Display', status: 'maintenance', battery: 45, lastSeen: '15 min ago' },
    { id: 'MQ-006', name: 'Store F - Fitting Area', status: 'online', battery: 89, lastSeen: '45 sec ago' },
  ];
  const mannequins = mannequinsProp && mannequinsProp.length > 0 ? mannequinsProp : defaultMannequins;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-red-500';
      case 'maintenance': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getBatteryColor = (battery: number) => {
    if (battery > 60) return 'text-green-600';
    if (battery > 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {mannequins.map((mannequin) => (
        <div key={mannequin.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-sm">{mannequin.id}</h3>
            <div className={`w-3 h-3 rounded-full ${getStatusColor(mannequin.status)}`} />
          </div>
          
          <p className="text-xs text-gray-600 mb-3">{mannequin.name}</p>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>Status:</span>
              <Badge variant={mannequin.status === 'online' ? 'default' : 'secondary'}>
                {mannequin.status}
              </Badge>
            </div>
            
            <div className="flex justify-between text-xs">
              <span>Battery:</span>
              <span className={getBatteryColor(mannequin.battery ?? 0)}>
                {mannequin.battery ?? '--'}%
              </span>
            </div>
            
            <div className="flex justify-between text-xs">
              <span>Last Seen:</span>
              <span className="text-gray-500">{mannequin.lastSeen ?? '--'}</span>
            </div>
          </div>
          
          <Button variant="outline" size="sm" className="w-full mt-3" onClick={() => onViewDetails?.(mannequin)}>
            View Details
          </Button>
        </div>
      ))}
    </div>
  );
}
