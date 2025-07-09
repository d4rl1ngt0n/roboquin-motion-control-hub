import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

const allHealthMetrics = [
  { label: 'System Uptime', value: 99.8, status: 'excellent', storeId: 'storeA', mannequinId: 'MQ-001' },
  { label: 'Network Connectivity', value: 97.2, status: 'good', storeId: 'storeA', mannequinId: 'MQ-002' },
  { label: 'Battery Health Average', value: 78.5, status: 'good', storeId: 'storeB', mannequinId: 'MQ-003' },
  { label: 'Servo Motor Health', value: 94.1, status: 'excellent', storeId: 'storeB', mannequinId: 'MQ-004' },
  { label: 'Firmware Compliance', value: 85.7, status: 'warning', storeId: 'storeD', mannequinId: 'MQ-005' },
];

const allRecentIssues = [
  { id: 1, device: 'MQ-003', issue: 'Low battery warning', severity: 'medium', time: '2 hours ago', storeId: 'storeB', mannequinId: 'MQ-003' },
  { id: 2, device: 'MQ-005', issue: 'Servo calibration needed', severity: 'low', time: '4 hours ago', storeId: 'storeD', mannequinId: 'MQ-005' },
  { id: 3, device: 'MQ-007', issue: 'Network connectivity lost', severity: 'high', time: '6 hours ago', storeId: 'storeF', mannequinId: 'MQ-007' },
];

export function SystemHealth({ selectedStore, selectedMannequin }) {
  let healthMetrics = allHealthMetrics;
  let recentIssues = allRecentIssues;

  if (selectedStore && selectedStore !== 'all') {
    healthMetrics = healthMetrics.filter(d => d.storeId === selectedStore);
    recentIssues = recentIssues.filter(d => d.storeId === selectedStore);
  }
  if (selectedMannequin && selectedMannequin !== 'all') {
    healthMetrics = healthMetrics.filter(d => d.mannequinId === selectedMannequin);
    recentIssues = recentIssues.filter(d => d.mannequinId === selectedMannequin);
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'warning': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusDescription = (status) => {
    switch (status) {
      case 'excellent': return 'Optimal performance';
      case 'good': return 'Normal operation';
      case 'warning': return 'Attention needed';
      case 'poor': return 'Critical attention required';
      default: return 'Unknown status';
    }
  };

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'high': return <Badge className="bg-red-100 text-red-800">High Priority</Badge>;
      case 'medium': return <Badge className="bg-yellow-100 text-yellow-800">Medium Priority</Badge>;
      case 'low': return <Badge className="bg-green-100 text-green-800">Low Priority</Badge>;
      default: return <Badge className="bg-gray-100 text-gray-800">Unknown Priority</Badge>;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>System Health Metrics</CardTitle>
          <p className="text-sm text-gray-500">Current status of key system components</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {healthMetrics.map((metric, index) => (
            <div key={index}>
              <div className="flex justify-between mb-2">
                <div>
                  <span className="text-sm font-medium">{metric.label}</span>
                  <p className="text-xs text-gray-500">{getStatusDescription(metric.status)}</p>
                </div>
                <span className={`text-sm font-bold ${getStatusColor(metric.status)}`}>{metric.value}%</span>
              </div>
              <Progress 
                value={metric.value} 
                className={`h-2 ${
                  metric.status === 'excellent' ? 'bg-green-100' :
                  metric.status === 'good' ? 'bg-blue-100' :
                  metric.status === 'warning' ? 'bg-yellow-100' :
                  'bg-red-100'
                }`} 
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent System Issues</CardTitle>
          <p className="text-sm text-gray-500">Latest alerts and issues requiring attention</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentIssues.map((issue) => (
              <div key={issue.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div>
                  <div className="font-medium">{issue.device}</div>
                  <div className="text-sm text-gray-600">{issue.issue}</div>
                  <div className="text-xs text-gray-500">Detected {issue.time}</div>
                </div>
                {getSeverityBadge(issue.severity)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
