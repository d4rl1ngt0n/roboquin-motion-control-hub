import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Smile, Users, BarChart3, PieChart, Lightbulb, Zap, ShoppingBag, Clock, ArrowUpRight } from 'lucide-react';
import { UsageMetrics } from './UsageMetrics';
import { SystemHealth } from './SystemHealth';
import { MovementAnalytics } from './MovementAnalytics';
import { UserEngagementAnalytics } from './UserEngagementAnalytics';
import { AdvancedInsightsAnalytics } from './AdvancedInsightsAnalytics';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

// Mock data for client's stores
const clientStores = [
  { id: 'storeA', name: 'Store A - Downtown' },
  { id: 'storeB', name: 'Store B - Mall' },
];

// Mock mannequin data per store
const mockMannequins = {
  storeA: [
    { id: 'M1', name: 'M1 - Window' },
    { id: 'M2', name: 'M2 - Entrance' },
  ],
  storeB: [
    { id: 'M3', name: 'M3 - Aisle' },
    { id: 'M4', name: 'M4 - Fitting Room' },
  ],
  storeC: [
    { id: 'M5', name: 'M5 - Display' },
    { id: 'M6', name: 'M6 - Checkout' },
  ],
};

const statCards = [
  {
    title: 'Increased Foot Traffic',
    value: '+18%',
    icon: Users,
    color: 'bg-blue-100 text-blue-800',
    description: 'vs last month',
  },
  {
    title: 'Customer Engagement',
    value: '1,200',
    icon: Smile,
    color: 'bg-green-100 text-green-800',
    description: 'Interactions this month',
  },
  {
    title: 'Avg. Dwell Time',
    value: '2.5 min',
    icon: Clock,
    color: 'bg-purple-100 text-purple-800',
    description: 'Per customer',
  },
  {
    title: 'Conversion Actions',
    value: '320',
    icon: ShoppingBag,
    color: 'bg-yellow-100 text-yellow-800',
    description: 'QR scans & info requests',
  },
];

const aiInsights = [
  {
    icon: TrendingUp,
    color: 'text-green-600',
    title: 'Peak Impact',
    description: 'Your mannequins drive the most engagement on weekends and during store promotions. Consider scheduling more dynamic movements during these times.'
  },
  {
    icon: BarChart3,
    color: 'text-blue-600',
    title: 'Store A Success',
    description: 'Store A saw a 22% increase in customer dwell time after deploying RoboQuin mannequins in the window display.'
  },
  {
    icon: PieChart,
    color: 'text-purple-600',
    title: 'Engagement Distribution',
    description: 'Customers spend 30% longer in areas with active mannequins compared to other zones.'
  },
];

const recommendations = [
  {
    icon: Lightbulb,
    color: 'text-yellow-500',
    title: 'Try This',
    description: 'Schedule a new movement preset for Store B during weekday afternoons to boost engagement.'
  },
  {
    icon: Zap,
    color: 'text-green-500',
    title: 'Expand Success',
    description: 'Consider adding a mannequin to Store C to replicate the success seen in Store A.'
  },
];

// Mock data for business results
const salesData = [
  { store: 'Store A', sales: 12000 },
  { store: 'Store B', sales: 9500 },
  { store: 'Store C', sales: 7000 },
];
const conversionData = [
  { action: 'QR Scans', value: 180, color: '#2563eb' },
  { action: 'Info Requests', value: 90, color: '#16a34a' },
  { action: 'Purchases', value: 50, color: '#ca8a04' },
];
const engagementData = [
  { month: 'Jan', engagement: 800 },
  { month: 'Feb', engagement: 950 },
  { month: 'Mar', engagement: 1200 },
  { month: 'Apr', engagement: 1100 },
];

// Mock data for robot performance
const uptimeData = [
  { day: 'Mon', uptime: 99 },
  { day: 'Tue', uptime: 98 },
  { day: 'Wed', uptime: 100 },
  { day: 'Thu', uptime: 97 },
  { day: 'Fri', uptime: 99 },
  { day: 'Sat', uptime: 100 },
  { day: 'Sun', uptime: 98 },
];
const maintenanceData = [
  { week: 'W1', issues: 1 },
  { week: 'W2', issues: 2 },
  { week: 'W3', issues: 0 },
  { week: 'W4', issues: 1 },
];
const usageData = [
  { hour: '09:00', movements: 45 },
  { hour: '10:00', movements: 67 },
  { hour: '11:00', movements: 89 },
  { hour: '12:00', movements: 123 },
  { hour: '13:00', movements: 98 },
  { hour: '14:00', movements: 76 },
  { hour: '15:00', movements: 112 },
  { hour: '16:00', movements: 134 },
  { hour: '17:00', movements: 87 },
  { hour: '18:00', movements: 56 },
];

// Helper functions for filtering mock data
function filterByMannequin(data, mannequinId) {
  if (mannequinId === 'all') return data;
  return data.filter((d) => d.mannequin === mannequinId);
}
function filterByStore(data, storeId) {
  if (storeId === 'all') return data;
  return data.filter((d) => d.storeId === storeId);
}

// Helper to get store name from id
function getStoreName(storeId) {
  return clientStores.find(s => s.id === storeId)?.name;
}
// Helper to get mannequin name from id
function getMannequinName(mannequinId) {
  const allMannequins = Object.values(mockMannequins).flat();
  return allMannequins.find(m => m.id === mannequinId)?.name;
}

// Filtering logic for all charts
function filterSalesData(storeId, mannequinId) {
  let data = salesData;
  if (storeId !== 'all') data = data.filter(d => d.store === getStoreName(storeId));
  // Sales data is by store only in this mock, so mannequin filter is not applied
  return data;
}
function filterEngagementData(storeId, mannequinId) {
  // Engagement data is not per store/mannequin in this mock, so we simulate filtering
  if (storeId === 'all' && mannequinId === 'all') return engagementData;
  if (storeId !== 'all' && mannequinId === 'all') return engagementData.map(d => ({ ...d, engagement: Math.round(d.engagement * 0.7) }));
  if (storeId === 'all' && mannequinId !== 'all') return engagementData.map(d => ({ ...d, engagement: Math.round(d.engagement * 0.5) }));
  if (storeId !== 'all' && mannequinId !== 'all') return engagementData.map(d => ({ ...d, engagement: Math.round(d.engagement * 0.3) }));
}
function filterConversionData(storeId, mannequinId) {
  if (storeId === 'all' && mannequinId === 'all') return conversionData;
  if (storeId !== 'all' && mannequinId === 'all') return conversionData.map(d => ({ ...d, value: Math.round(d.value * 0.7) }));
  if (storeId === 'all' && mannequinId !== 'all') return conversionData.map(d => ({ ...d, value: Math.round(d.value * 0.5) }));
  if (storeId !== 'all' && mannequinId !== 'all') return conversionData.map(d => ({ ...d, value: Math.round(d.value * 0.3) }));
}
function filterUptimeData(storeId, mannequinId) {
  if (storeId === 'all' && mannequinId === 'all') return uptimeData;
  if (storeId !== 'all' && mannequinId === 'all') return uptimeData.map(d => ({ ...d, uptime: Math.max(95, d.uptime - 1) }));
  if (storeId === 'all' && mannequinId !== 'all') return uptimeData.map(d => ({ ...d, uptime: Math.max(95, d.uptime - 2) }));
  if (storeId !== 'all' && mannequinId !== 'all') return uptimeData.map(d => ({ ...d, uptime: Math.max(95, d.uptime - 3) }));
}
function filterMaintenanceData(storeId, mannequinId) {
  if (storeId === 'all' && mannequinId === 'all') return maintenanceData;
  if (storeId !== 'all' && mannequinId === 'all') return maintenanceData.map(d => ({ ...d, issues: Math.max(0, d.issues - 1) }));
  if (storeId === 'all' && mannequinId !== 'all') return maintenanceData.map(d => ({ ...d, issues: Math.max(0, d.issues - 1) }));
  if (storeId !== 'all' && mannequinId !== 'all') return maintenanceData.map(d => ({ ...d, issues: Math.max(0, d.issues - 2) }));
}
function filterUsageData(storeId, mannequinId) {
  if (storeId === 'all' && mannequinId === 'all') return usageData;
  if (storeId !== 'all' && mannequinId === 'all') return usageData.map(d => ({ ...d, movements: Math.round(d.movements * 0.7) }));
  if (storeId === 'all' && mannequinId !== 'all') return usageData.map(d => ({ ...d, movements: Math.round(d.movements * 0.5) }));
  if (storeId !== 'all' && mannequinId !== 'all') return usageData.map(d => ({ ...d, movements: Math.round(d.movements * 0.3) }));
}
// For Engagement Breakdown tab
function filterEngagementByHourData(storeId, mannequinId) {
  const base = [
    { hour: '09:00', engagement: 30 },
    { hour: '10:00', engagement: 45 },
    { hour: '11:00', engagement: 60 },
    { hour: '12:00', engagement: 80 },
    { hour: '13:00', engagement: 70 },
    { hour: '14:00', engagement: 55 },
    { hour: '15:00', engagement: 90 },
    { hour: '16:00', engagement: 110 },
    { hour: '17:00', engagement: 75 },
    { hour: '18:00', engagement: 40 },
  ];
  if (storeId === 'all' && mannequinId === 'all') return base;
  if (storeId !== 'all' && mannequinId === 'all') return base.map(d => ({ ...d, engagement: Math.round(d.engagement * 0.7) }));
  if (storeId === 'all' && mannequinId !== 'all') return base.map(d => ({ ...d, engagement: Math.round(d.engagement * 0.5) }));
  if (storeId !== 'all' && mannequinId !== 'all') return base.map(d => ({ ...d, engagement: Math.round(d.engagement * 0.3) }));
}
function filterTopMannequinsData(storeId, mannequinId) {
  // This is a mock; in real data, filter by store and mannequin
  const base = [
    { mannequin: 'M1', engagement: 320 },
    { mannequin: 'M2', engagement: 280 },
    { mannequin: 'M3', engagement: 210 },
    { mannequin: 'M4', engagement: 150 },
  ];
  if (storeId === 'all' && mannequinId === 'all') return base;
  if (storeId !== 'all' && mannequinId === 'all') return base.map(d => ({ ...d, engagement: Math.round(d.engagement * 0.7) }));
  if (storeId === 'all' && mannequinId !== 'all') return base.filter(d => d.mannequin === mannequinId);
  if (storeId !== 'all' && mannequinId !== 'all') return base.filter(d => d.mannequin === mannequinId).map(d => ({ ...d, engagement: Math.round(d.engagement * 0.3) }));
}
function filterMovementsOverTimeData(storeId, mannequinId) {
  const base = [
    { day: 'Mon', movements: 120 },
    { day: 'Tue', movements: 140 },
    { day: 'Wed', movements: 110 },
    { day: 'Thu', movements: 160 },
    { day: 'Fri', movements: 180 },
    { day: 'Sat', movements: 200 },
    { day: 'Sun', movements: 170 },
  ];
  if (storeId === 'all' && mannequinId === 'all') return base;
  if (storeId !== 'all' && mannequinId === 'all') return base.map(d => ({ ...d, movements: Math.round(d.movements * 0.7) }));
  if (storeId === 'all' && mannequinId !== 'all') return base.map(d => ({ ...d, movements: Math.round(d.movements * 0.5) }));
  if (storeId !== 'all' && mannequinId !== 'all') return base.map(d => ({ ...d, movements: Math.round(d.movements * 0.3) }));
}
function filterMostActiveMannequinsData(storeId, mannequinId) {
  const base = [
    { mannequin: 'M1', movements: 520 },
    { mannequin: 'M2', movements: 480 },
    { mannequin: 'M3', movements: 410 },
    { mannequin: 'M4', movements: 350 },
  ];
  if (storeId === 'all' && mannequinId === 'all') return base;
  if (storeId !== 'all' && mannequinId === 'all') return base.map(d => ({ ...d, movements: Math.round(d.movements * 0.7) }));
  if (storeId === 'all' && mannequinId !== 'all') return base.filter(d => d.mannequin === mannequinId);
  if (storeId !== 'all' && mannequinId !== 'all') return base.filter(d => d.mannequin === mannequinId).map(d => ({ ...d, movements: Math.round(d.movements * 0.3) }));
}

export function ClientAnalytics() {
  const [selectedStore, setSelectedStore] = useState('all');
  const [selectedMannequin, setSelectedMannequin] = useState('all');

  // Get mannequins for the selected store
  let availableMannequins = [{ id: 'all', name: 'All Mannequins' }];
  if (selectedStore === 'all') {
    // If all stores, show mannequins from all stores
    const mannequinsArr = clientStores.flatMap(store => mockMannequins[store.id] || []);
    // Remove duplicates by id
    const uniqueMannequins = Array.from(new Map(mannequinsArr.map(m => [m.id, m])).values());
    availableMannequins = [{ id: 'all', name: 'All Mannequins' }, ...uniqueMannequins];
  } else {
    availableMannequins = [{ id: 'all', name: 'All Mannequins' }, ...(mockMannequins[selectedStore] || [])];
  }

  // Example: Filtered data for each chart (mock logic)
  // In a real app, you would filter real data from the backend
  // For demonstration, we just show how to filter by mannequin or store
  const filteredSalesData = selectedStore === 'all' ? salesData : salesData.filter(d => d.store === clientStores.find(s => s.id === selectedStore)?.name);
  const filteredEngagementData = selectedMannequin === 'all' ? engagementData : engagementData.map(d => ({ ...d, engagement: Math.round(d.engagement * 0.5) })); // mock: halve engagement for a mannequin
  const filteredConversionData = selectedMannequin === 'all' ? conversionData : conversionData.map(d => ({ ...d, value: Math.round(d.value * 0.5) }));
  const filteredUptimeData = selectedMannequin === 'all' ? uptimeData : uptimeData.map(d => ({ ...d, uptime: Math.max(95, d.uptime - 2) }));
  const filteredMaintenanceData = selectedMannequin === 'all' ? maintenanceData : maintenanceData.map(d => ({ ...d, issues: Math.max(0, d.issues - 1) }));
  const filteredUsageData = selectedMannequin === 'all' ? usageData : usageData.map(d => ({ ...d, movements: Math.round(d.movements * 0.5) }));

  // For Engagement Breakdown tab
  const engagementByHourData = selectedMannequin === 'all' ? [
    { hour: '09:00', engagement: 30 },
    { hour: '10:00', engagement: 45 },
    { hour: '11:00', engagement: 60 },
    { hour: '12:00', engagement: 80 },
    { hour: '13:00', engagement: 70 },
    { hour: '14:00', engagement: 55 },
    { hour: '15:00', engagement: 90 },
    { hour: '16:00', engagement: 110 },
    { hour: '17:00', engagement: 75 },
    { hour: '18:00', engagement: 40 },
  ] : [
    { hour: '09:00', engagement: 10 },
    { hour: '10:00', engagement: 20 },
    { hour: '11:00', engagement: 30 },
    { hour: '12:00', engagement: 40 },
    { hour: '13:00', engagement: 35 },
    { hour: '14:00', engagement: 25 },
    { hour: '15:00', engagement: 45 },
    { hour: '16:00', engagement: 55 },
    { hour: '17:00', engagement: 35 },
    { hour: '18:00', engagement: 15 },
  ];
  const topMannequinsData = selectedStore === 'all' ? [
    { mannequin: 'M1', engagement: 320 },
    { mannequin: 'M2', engagement: 280 },
    { mannequin: 'M3', engagement: 210 },
    { mannequin: 'M4', engagement: 150 },
  ] : [
    { mannequin: 'M1', engagement: 120 },
    { mannequin: 'M2', engagement: 80 },
    { mannequin: 'M3', engagement: 60 },
    { mannequin: 'M4', engagement: 40 },
  ];
  // For Movement Analytics tab
  const movementsOverTimeData = selectedMannequin === 'all' ? [
    { day: 'Mon', movements: 120 },
    { day: 'Tue', movements: 140 },
    { day: 'Wed', movements: 110 },
    { day: 'Thu', movements: 160 },
    { day: 'Fri', movements: 180 },
    { day: 'Sat', movements: 200 },
    { day: 'Sun', movements: 170 },
  ] : [
    { day: 'Mon', movements: 40 },
    { day: 'Tue', movements: 50 },
    { day: 'Wed', movements: 30 },
    { day: 'Thu', movements: 60 },
    { day: 'Fri', movements: 80 },
    { day: 'Sat', movements: 90 },
    { day: 'Sun', movements: 70 },
  ];
  const mostActiveMannequinsData = selectedStore === 'all' ? [
    { mannequin: 'M1', movements: 520 },
    { mannequin: 'M2', movements: 480 },
    { mannequin: 'M3', movements: 410 },
    { mannequin: 'M4', movements: 350 },
  ] : [
    { mannequin: 'M1', movements: 220 },
    { mannequin: 'M2', movements: 180 },
    { mannequin: 'M3', movements: 110 },
    { mannequin: 'M4', movements: 90 },
  ];

  // Helper for AI feedback context
  const storeLabel = selectedStore === 'all' ? 'all stores' : clientStores.find(s => s.id === selectedStore)?.name;
  const mannequinLabel = selectedMannequin === 'all' ? 'all mannequins' : availableMannequins.find(m => m.id === selectedMannequin)?.name;

  return (
    <div className="space-y-8">
      {/* Filter selectors */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-end mb-2">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-700">Store:</span>
          <Select value={selectedStore} onValueChange={value => { setSelectedStore(value); setSelectedMannequin('all'); }}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stores</SelectItem>
              {clientStores.map(store => (
                <SelectItem key={store.id} value={store.id}>{store.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-700">Mannequin:</span>
          <Select value={selectedMannequin} onValueChange={setSelectedMannequin}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availableMannequins.map(m => (
                <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Tabs defaultValue="business" className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-6">
          <TabsTrigger value="business">Business Results</TabsTrigger>
          <TabsTrigger value="robot">Robot Performance</TabsTrigger>
          <TabsTrigger value="engagement">Engagement Breakdown</TabsTrigger>
          <TabsTrigger value="movement">Movement Analytics</TabsTrigger>
          <TabsTrigger value="insights">Advanced Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="business">
          {/* Business Results Tab */}
          <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-lg p-6 text-white shadow-lg mb-6">
            <h1 className="text-3xl font-bold mb-1 flex items-center gap-2">
              <Smile className="w-7 h-7 text-yellow-300 animate-bounce" />
              Business Impact & Engagement Metrics
            </h1>
            <p className="text-green-100 text-lg">See how RoboQuin mannequins are driving value for {storeLabel}</p>
          </div>
          {/* Customer Engagement Chart */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Customer Engagement by Store
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={filterSalesData(selectedStore, selectedMannequin)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="store" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="sales" fill="#2563eb" name="Engagements" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          {/* Conversion Actions Pie Chart */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-purple-600" />
                Conversion Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={filterConversionData(selectedStore, selectedMannequin)}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ action, value }) => `${action}: ${value}`}
                    >
                      {filterConversionData(selectedStore, selectedMannequin).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          {/* Engagement Over Time */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-green-600" />
                Customer Engagement Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={filterEngagementData(selectedStore, selectedMannequin)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="engagement" stroke="#16a34a" strokeWidth={3} name="Engagements" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          {/* AI Business Insights */}
          <Card className="border-0 bg-gradient-to-br from-white to-green-50 mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-500 animate-bounce" />
                AI Business Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="text-green-800 font-medium">Your mannequins generated 1,200 customer engagements this month for {storeLabel} ({mannequinLabel}).</li>
                <li className="text-blue-800">Engagement is highest in Store A's window display during weekends. (Current filter: {storeLabel}, {mannequinLabel})</li>
                <li className="text-purple-800">Customers who interact with mannequins are 2.3x more likely to make a purchase. (Current filter: {storeLabel}, {mannequinLabel})</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="robot">
          {/* Robot Performance Tab */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg p-6 text-white shadow-lg mb-6">
            <h1 className="text-3xl font-bold mb-1 flex items-center gap-2">
              <Zap className="w-7 h-7 text-yellow-300 animate-pulse" />
              Robot Performance & Health
            </h1>
            <p className="text-blue-100 text-lg">Monitor your mannequins' technical status and reliability for {storeLabel} ({mannequinLabel})</p>
          </div>
          {/* Uptime Chart */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Uptime by Day
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={filterUptimeData(selectedStore, selectedMannequin)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis domain={[95, 100]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="uptime" stroke="#2563eb" strokeWidth={3} name="Uptime (%)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          {/* Maintenance Issues Chart */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-red-600" />
                Maintenance Issues by Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={filterMaintenanceData(selectedStore, selectedMannequin)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="issues" fill="#dc2626" name="Issues" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          {/* Usage Patterns Chart */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                Usage Patterns (Movements by Hour)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={filterUsageData(selectedStore, selectedMannequin)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="movements" fill="#8b5cf6" name="Movements" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          {/* AI Technical Insights */}
          <Card className="border-0 bg-gradient-to-br from-white to-blue-50 mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-blue-500 animate-bounce" />
                AI Technical Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="text-blue-800 font-medium">All mannequins are currently online and operational for {storeLabel} ({mannequinLabel}).</li>
                <li className="text-red-800">2 mannequins are due for maintenance in the next 2 weeks. (Current filter: {storeLabel}, {mannequinLabel})</li>
                <li className="text-purple-800">Average uptime this week: 98.7%. (Current filter: {storeLabel}, {mannequinLabel})</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="engagement">
          {/* Engagement Breakdown Tab */}
          <div className="bg-gradient-to-r from-pink-500 to-yellow-500 rounded-lg p-6 text-white shadow-lg mb-6">
            <h1 className="text-3xl font-bold mb-1 flex items-center gap-2">
              <Users className="w-7 h-7 text-yellow-300 animate-bounce" />
              Engagement Breakdown
            </h1>
            <p className="text-yellow-100 text-lg">Deep dive into how customers interact with your mannequins ({storeLabel}, {mannequinLabel})</p>
          </div>
          {/* Engagement by Hour Chart */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-pink-600" />
                Engagement by Hour
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={filterEngagementByHourData(selectedStore, selectedMannequin)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="engagement" fill="#ec4899" name="Engagements" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          {/* Top Mannequins by Engagement */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-yellow-600" />
                Top Mannequins by Engagement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={filterTopMannequinsData(selectedStore, selectedMannequin)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mannequin" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="engagement" fill="#f59e42" name="Engagements" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          {/* AI Engagement Insights */}
          <Card className="border-0 bg-gradient-to-br from-white to-yellow-50 mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-500 animate-bounce" />
                AI Engagement Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="text-yellow-800 font-medium">Engagement peaks at 4pm, especially for M1 and M2. (Current filter: {storeLabel}, {mannequinLabel})</li>
                <li className="text-pink-800">Mannequins near store entrances see 2x more engagement. (Current filter: {storeLabel}, {mannequinLabel})</li>
                <li className="text-orange-800">Consider rotating mannequins to high-traffic areas for maximum impact. (Current filter: {storeLabel}, {mannequinLabel})</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="movement">
          {/* Movement Analytics Tab */}
          <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg p-6 text-white shadow-lg mb-6">
            <h1 className="text-3xl font-bold mb-1 flex items-center gap-2">
              <Zap className="w-7 h-7 text-yellow-300 animate-pulse" />
              Movement Analytics
            </h1>
            <p className="text-indigo-100 text-lg">Analyze mannequin movement patterns and activity ({storeLabel}, {mannequinLabel})</p>
          </div>
          {/* Movements Over Time Chart */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                Movements Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={filterMovementsOverTimeData(selectedStore, selectedMannequin)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="movements" stroke="#a21caf" strokeWidth={3} name="Movements" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          {/* Most Active Mannequins Chart */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                Most Active Mannequins
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={filterMostActiveMannequinsData(selectedStore, selectedMannequin)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mannequin" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="movements" fill="#6366f1" name="Movements" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          {/* AI Movement Insights */}
          <Card className="border-0 bg-gradient-to-br from-white to-indigo-50 mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-indigo-500 animate-bounce" />
                AI Movement Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="text-indigo-800 font-medium">Saturday is the most active day for mannequin movements. (Current filter: {storeLabel}, {mannequinLabel})</li>
                <li className="text-purple-800">M1 and M2 are the most dynamic mannequins this week. (Current filter: {storeLabel}, {mannequinLabel})</li>
                <li className="text-blue-800">Try new movement presets to increase activity on slower days. (Current filter: {storeLabel}, {mannequinLabel})</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="insights">
          {/* Advanced Insights Tab */}
          <div className="bg-gradient-to-r from-green-400 to-blue-400 rounded-lg p-6 text-white shadow-lg mb-6">
            <h1 className="text-3xl font-bold mb-1 flex items-center gap-2">
              <Lightbulb className="w-7 h-7 text-yellow-300 animate-bounce" />
              Advanced Insights
            </h1>
            <p className="text-blue-100 text-lg">AI-driven recommendations and trends for your business ({storeLabel}, {mannequinLabel})</p>
          </div>
          {/* Predicted Trends Chart */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-green-600" />
                Predicted Engagement Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={filterEngagementData(selectedStore, selectedMannequin)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="engagement" stroke="#22c55e" strokeWidth={3} name="Predicted Engagement" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          {/* Outlier Events Chart */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-blue-600" />
                Outlier Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={filterConversionData(selectedStore, selectedMannequin)}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ action, value }) => `${action}: ${value}`}
                    >
                      {filterConversionData(selectedStore, selectedMannequin).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          {/* AI Recommendations */}
          <Card className="border-0 bg-gradient-to-br from-white to-blue-50 mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-blue-500 animate-bounce" />
                AI Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="text-green-800 font-medium">AI predicts a 15% increase in engagement during the summer months for {storeLabel} ({mannequinLabel}).</li>
                <li className="text-blue-800">Plan promotions around predicted spikes for maximum impact. (Current filter: {storeLabel}, {mannequinLabel})</li>
                <li className="text-purple-800">Watch for outlier events to quickly adapt your strategy. (Current filter: {storeLabel}, {mannequinLabel})</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 