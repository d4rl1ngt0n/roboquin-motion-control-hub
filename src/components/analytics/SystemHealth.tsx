
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

export function SystemHealth() {
  const healthMetrics = [
    { label: 'System Uptime', value: 99.8, status: 'excellent' },
    { label: 'Network Connectivity', value: 97.2, status: 'good' },
    { label: 'Battery Health Average', value: 78.5, status: 'good' },
    { label: 'Servo Motor Health', value: 94.1, status: 'excellent' },
    { label: 'Firmware Compliance', value: 85.7, status: 'warning' },
  ];

  const recentIssues = [
    { id: 1, device: 'MQ-003', issue: 'Low battery warning', severity: 'medium', time: '2 hours ago' },
    { id: 2, device: 'MQ-005', issue: 'Servo calibration needed', severity: 'low', time: '4 hours ago' },
    { id: 3, device: 'MQ-007', issue: 'Network connectivity lost', severity: 'high', time: '6 hours ago' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'warning': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high': return <Badge className="bg-red-100 text-red-800">High</Badge>;
      case 'medium': return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case 'low': return <Badge className="bg-green-100 text-green-800">Low</Badge>;
      default: return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Health Metrics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {healthMetrics.map((metric, index) => (
            <div key={index}>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">{metric.label}</span>
                <span className={`text-sm font-bold ${getStatusColor(metric.status)}`}>
                  {metric.value}%
                </span>
              </div>
              <Progress value={metric.value} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Issues</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentIssues.map((issue) => (
              <div key={issue.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">{issue.device}</div>
                  <div className="text-sm text-gray-600">{issue.issue}</div>
                  <div className="text-xs text-gray-500">{issue.time}</div>
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
