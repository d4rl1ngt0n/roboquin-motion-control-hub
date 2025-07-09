import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UsageMetrics } from './UsageMetrics';
import { SystemHealth } from './SystemHealth';
import { MovementAnalytics } from './MovementAnalytics';
import { UserEngagementAnalytics } from './UserEngagementAnalytics';
import { AdvancedInsightsAnalytics } from './AdvancedInsightsAnalytics';
import { CustomerEngagementMetrics } from './CustomerEngagementMetrics';
import { VisualTrackingSystem } from './VisualTrackingSystem';
import { Brain, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Info, Lightbulb, BarChart3, PieChart, Zap, Users, Activity, Monitor } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const mockStores = [
  { id: 'all', name: 'All Stores' },
  { id: 'storeA', name: 'Store A' },
  { id: 'storeB', name: 'Store B' },
  { id: 'storeD', name: 'Store D' },
  { id: 'storeF', name: 'Store F' },
];

const mockMannequins = {
  all: [
    { id: 'all', name: 'All Mannequins' },
  ],
  storeA: [
    { id: 'all', name: 'All Mannequins' },
    { id: 'MQ-001', name: 'Window Display' },
    { id: 'MQ-002', name: 'Main Floor' },
  ],
  storeB: [
    { id: 'all', name: 'All Mannequins' },
    { id: 'MQ-003', name: 'Entrance' },
    { id: 'MQ-004', name: 'VIP Section' },
  ],
  storeD: [
    { id: 'all', name: 'All Mannequins' },
    { id: 'MQ-005', name: 'Seasonal Display' },
    { id: 'MQ-006', name: 'Fitting Area' },
  ],
  storeF: [
    { id: 'all', name: 'All Mannequins' },
    { id: 'MQ-007', name: 'Main Floor' },
    { id: 'MQ-008', name: 'VIP Section' },
  ],
};

// AI Insights Data
const aiInsights = {
  performance: {
    trend: 'up',
    percentage: 15.3,
    insight: 'Your mannequin network is performing 15.3% better than last month. This improvement is primarily driven by increased user engagement and optimized movement patterns.',
    recommendation: 'Consider expanding the successful movement sequences to other locations.'
  },
  health: {
    trend: 'stable',
    percentage: 2.1,
    insight: 'System health is stable with only a 2.1% variance. All critical systems are operating within optimal parameters.',
    recommendation: 'Continue current maintenance schedule. No immediate action required.'
  },
  engagement: {
    trend: 'up',
    percentage: 23.7,
    insight: 'User engagement has increased by 23.7% this month. The new interactive features are resonating well with customers.',
    recommendation: 'Consider adding more interactive elements to capitalize on this trend.'
  },
  anomalies: [
    {
      type: 'warning',
      title: 'Unusual Activity Pattern',
      description: 'MQ-003 at Store B Entrance shows 40% higher movement frequency during off-peak hours.',
      impact: 'medium',
      suggestion: 'Review scheduling algorithm for this location.'
    },
    {
      type: 'info',
      title: 'Performance Optimization Opportunity',
      description: 'Store A Window Display (MQ-001) has 95% uptime but only 60% engagement rate.',
      impact: 'low',
      suggestion: 'Consider repositioning or updating content to increase engagement.'
    }
  ]
};

export function Analytics() {
  const [selectedStore, setSelectedStore] = useState('all');
  const [selectedMannequin, setSelectedMannequin] = useState('all');
  const mannequinsForStore = mockMannequins[selectedStore] || mockMannequins['all'];
  const now = new Date();

  // Animated stat cards data
  const statCards = [
    {
      title: 'Total Mannequins',
      value: 7,
      icon: Monitor,
      color: 'bg-blue-100 text-blue-800',
      trend: '+12%',
      description: 'Across all stores',
    },
    {
      title: 'Active',
      value: 4,
      icon: Zap,
      color: 'bg-green-100 text-green-800',
      trend: '+8%',
      description: 'Currently online',
    },
    {
      title: 'Critical Issues',
      value: 3,
      icon: AlertTriangle,
      color: 'bg-red-100 text-red-800',
      trend: '+2',
      description: 'Need urgent attention',
    },
    {
      title: 'Engagement Rate',
      value: '78%',
      icon: Users,
      color: 'bg-purple-100 text-purple-800',
      trend: '+23%',
      description: 'Customer interactions',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Modern AI Header */}
      <div className="bg-gradient-to-r from-blue-700 to-purple-700 rounded-lg p-6 text-white shadow-lg flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-1 flex items-center gap-2">
            <Brain className="w-7 h-7 text-yellow-300 animate-pulse" />
            AI-Powered Analytics
          </h1>
          <p className="text-blue-100 text-lg">Real-time insights and trends for your mannequin network</p>
        </div>
        <div className="mt-4 md:mt-0 text-blue-200 text-sm text-right">
          Last updated: {now.toLocaleDateString()} {now.toLocaleTimeString()}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <Card key={idx} className="hover:shadow-lg transition-shadow">
            <CardContent className="flex flex-col items-center p-6">
              <div className={`p-3 rounded-full mb-2 ${stat.color}`}><stat.icon className="w-6 h-6" /></div>
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-xs text-gray-500 mb-1">{stat.description}</div>
              <div className="flex items-center gap-1 text-xs">
                <TrendingUp className="w-3 h-3 text-green-600" />
                <span className="font-semibold text-green-600">{stat.trend}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Insights Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900">Performance</h3>
              {aiInsights.performance.trend === 'up' ? <TrendingUp className="w-4 h-4 text-green-600" /> : <TrendingDown className="w-4 h-4 text-red-600" />}
            </div>
            <p className="text-2xl font-bold text-green-600">+{aiInsights.performance.percentage}%</p>
            <p className="text-sm text-gray-600 mt-1">{aiInsights.performance.insight}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900">System Health</h3>
              <CheckCircle className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-blue-600">{aiInsights.health.percentage}%</p>
            <p className="text-sm text-gray-600 mt-1">{aiInsights.health.insight}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900">User Engagement</h3>
              <TrendingUp className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-purple-600">+{aiInsights.engagement.percentage}%</p>
            <p className="text-sm text-gray-600 mt-1">{aiInsights.engagement.insight}</p>
          </CardContent>
        </Card>
      </div>

      {/* AI Recommendations */}
      <Card className="border-0 bg-gradient-to-br from-yellow-50 to-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-500 animate-bounce" />
            AI Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900">Performance Optimization</h4>
                <p className="text-sm text-blue-700">{aiInsights.performance.recommendation}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <Lightbulb className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-green-900">System Maintenance</h4>
                <p className="text-sm text-green-700">{aiInsights.health.recommendation}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
              <Lightbulb className="w-5 h-5 text-purple-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-purple-900">Engagement Strategy</h4>
                <p className="text-sm text-purple-700">{aiInsights.engagement.recommendation}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Anomalies and Alerts */}
      <div className="space-y-3">
        {aiInsights.anomalies.map((anomaly, index) => (
          <Alert key={index} className={anomaly.type === 'warning' ? 'border-yellow-200 bg-yellow-50' : 'border-blue-200 bg-blue-50'}>
            {anomaly.type === 'warning' ? (
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            ) : (
              <Info className="h-4 w-4 text-blue-600" />
            )}
            <AlertDescription>
              <span className="font-semibold">{anomaly.title}:</span> {anomaly.description}
              <br />
              <span className="text-xs text-gray-500">Suggestion: {anomaly.suggestion}</span>
            </AlertDescription>
          </Alert>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mt-8">
        <div className="flex gap-4 w-full md:w-auto">
          <div>
            <label className="text-sm font-medium mb-2 block">Select Store</label>
            <select
              className="border rounded px-3 py-2 text-sm"
              value={selectedStore}
              onChange={e => {
                setSelectedStore(e.target.value);
                setSelectedMannequin('all');
              }}
            >
              {mockStores.map(store => (
                <option key={store.id} value={store.id}>{store.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Select Mannequin</label>
            <select
              className="border rounded px-3 py-2 text-sm"
              value={selectedMannequin}
              onChange={e => setSelectedMannequin(e.target.value)}
            >
              {mannequinsForStore.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="text-xs text-gray-500 mt-2 md:mt-0">AI-powered analytics are updated every 5 minutes.</div>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="usage" className="w-full mt-4">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="usage">Usage Metrics</TabsTrigger>
          <TabsTrigger value="health">System Health</TabsTrigger>
          <TabsTrigger value="movements">Movement Analytics</TabsTrigger>
          <TabsTrigger value="engagement">User Engagement</TabsTrigger>
          <TabsTrigger value="customer-engagement">Customer Engagement</TabsTrigger>
          <TabsTrigger value="visual-tracking">Visual Tracking</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="usage">
          <UsageMetrics selectedStore={selectedStore} selectedMannequin={selectedMannequin} />
        </TabsContent>
        <TabsContent value="health">
          <SystemHealth selectedStore={selectedStore} selectedMannequin={selectedMannequin} />
        </TabsContent>
        <TabsContent value="movements">
          <MovementAnalytics selectedStore={selectedStore} selectedMannequin={selectedMannequin} />
        </TabsContent>
        <TabsContent value="engagement">
          <UserEngagementAnalytics selectedStore={selectedStore} selectedMannequin={selectedMannequin} />
        </TabsContent>
        <TabsContent value="customer-engagement">
          <CustomerEngagementMetrics />
        </TabsContent>
        <TabsContent value="visual-tracking">
          <VisualTrackingSystem />
        </TabsContent>
        <TabsContent value="advanced">
          <AdvancedInsightsAnalytics selectedStore={selectedStore} selectedMannequin={selectedMannequin} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
