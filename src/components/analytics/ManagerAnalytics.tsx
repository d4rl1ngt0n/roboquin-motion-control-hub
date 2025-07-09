import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Smile, Users, BarChart3, PieChart, Lightbulb, Zap } from 'lucide-react';

// Mock data for clients and their stores
const mockClients = [
  { id: 'client1', name: 'Fashion Retailer A' },
  { id: 'client2', name: 'Luxury Boutique B' },
];
const mockStores = {
  client1: [
    { id: 'storeD', name: 'Store D - Seasonal Display' },
    { id: 'storeE', name: 'Store E - Fitting Area' },
  ],
  client2: [
    { id: 'storeF', name: 'Store F - Main Floor' },
    { id: 'storeG', name: 'Store G - VIP Section' },
  ],
};
const mannequins = [
  { id: 'all', name: 'All Mannequins' },
  { id: 'MQ-005', name: 'MQ-005' },
  { id: 'MQ-006', name: 'MQ-006' },
  { id: 'MQ-007', name: 'MQ-007' },
  { id: 'MQ-008', name: 'MQ-008' },
];

// Mock analytics data (replace with real data as needed)
const salesData = [
  { store: 'Store D - Seasonal Display', sales: 12000 },
  { store: 'Store E - Fitting Area', sales: 9500 },
  { store: 'Store F - Main Floor', sales: 7000 },
  { store: 'Store G - VIP Section', sales: 8000 },
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

// Mock mannequin data per store
const mockMannequins = {
  storeD: [
    { id: 'MQ-005', name: 'MQ-005 - Window' },
    { id: 'MQ-006', name: 'MQ-006 - Entrance' },
  ],
  storeE: [
    { id: 'MQ-007', name: 'MQ-007 - Fitting Room' },
    { id: 'MQ-008', name: 'MQ-008 - Display' },
  ],
  storeF: [
    { id: 'MQ-009', name: 'MQ-009 - Main Floor' },
    { id: 'MQ-010', name: 'MQ-010 - VIP' },
  ],
  storeG: [
    { id: 'MQ-011', name: 'MQ-011 - Lounge' },
    { id: 'MQ-012', name: 'MQ-012 - Entry' },
  ],
};

// Helper for filtering mock data
function filterByStore(data, storeId) {
  if (storeId === 'all') return data;
  return data.filter((d) => d.store === (Object.values(mockStores).flat().find(s => s.id === storeId)?.name));
}
function filterByMannequin(data, mannequinId) {
  if (mannequinId === 'all') return data;
  return data.map(d => ({ ...d, engagement: Math.round((d.engagement || 0) * 0.5), movements: Math.round((d.movements || 0) * 0.5) }));
}

export function ManagerAnalytics() {
  const [selectedClient, setSelectedClient] = useState('all');
  const [selectedStore, setSelectedStore] = useState('all');
  const [selectedMannequin, setSelectedMannequin] = useState('all');

  // Get available clients and stores
  const availableClients = mockClients;
  const availableStores = selectedClient === 'all'
    ? Object.values(mockStores).flat()
    : mockStores[selectedClient as keyof typeof mockStores] || [];

  // Get mannequins for the selected store
  let availableMannequins = [{ id: 'all', name: 'All Mannequins' }];
  if (selectedStore === 'all') {
    // If all stores, show mannequins from all visible stores
    const mannequinsArr = availableStores.flatMap(store => mockMannequins[store.id] || []);
    // Remove duplicates by id
    const uniqueMannequins = Array.from(new Map(mannequinsArr.map(m => [m.id, m])).values());
    availableMannequins = [{ id: 'all', name: 'All Mannequins' }, ...uniqueMannequins];
  } else {
    availableMannequins = [{ id: 'all', name: 'All Mannequins' }, ...(mockMannequins[selectedStore] || [])];
  }

  // Filtered data for charts
  const filteredSalesData = filterByStore(salesData, selectedStore);
  const filteredEngagementData = filterByMannequin(engagementData, selectedMannequin);
  const filteredConversionData = filterByMannequin(conversionData, selectedMannequin);
  const filteredUptimeData = filterByMannequin(uptimeData, selectedMannequin);
  const filteredMaintenanceData = filterByMannequin(maintenanceData, selectedMannequin);
  const filteredUsageData = filterByMannequin(usageData, selectedMannequin);

  // Helper for AI feedback context
  const clientLabel = selectedClient === 'all' ? 'all clients' : availableClients.find(c => c.id === selectedClient)?.name;
  const storeLabel = selectedStore === 'all' ? 'all stores' : availableStores.find(s => s.id === selectedStore)?.name;
  const mannequinLabel = selectedMannequin === 'all' ? 'all mannequins' : mannequins.find(m => m.id === selectedMannequin)?.name;

  return (
    <div className="space-y-8">
      {/* Filter selectors */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-end mb-2">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-700">Client:</span>
          <Select value={selectedClient} onValueChange={value => { setSelectedClient(value); setSelectedStore('all'); setSelectedMannequin('all'); }}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Clients</SelectItem>
              {availableClients.map(client => (
                <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-700">Store:</span>
          <Select value={selectedStore} onValueChange={value => { setSelectedStore(value); setSelectedMannequin('all'); }}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stores</SelectItem>
              {availableStores.map(store => (
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
        {/* Business Results Tab */}
        <TabsContent value="business">
          <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-lg p-6 text-white shadow-lg mb-6">
            <h1 className="text-3xl font-bold mb-1 flex items-center gap-2">
              <Smile className="w-7 h-7 text-yellow-300 animate-bounce" />
              Business Impact & Engagement Metrics
            </h1>
            <p className="text-green-100 text-lg">See how RoboQuin mannequins are driving value for {clientLabel}, {storeLabel}</p>
          </div>
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
                  <BarChart data={filteredSalesData}>
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
                      data={filteredConversionData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ action, value }) => `${action}: ${value}`}
                    >
                      {filteredConversionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
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
                  <LineChart data={filteredEngagementData}>
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
          <Card className="border-0 bg-gradient-to-br from-white to-green-50 mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-500 animate-bounce" />
                AI Business Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="text-green-800 font-medium">Your mannequins generated 1,200 customer engagements this month for {clientLabel}, {storeLabel} ({mannequinLabel}).</li>
                <li className="text-blue-800">Engagement is highest in Store D's window display during weekends. (Current filter: {clientLabel}, {storeLabel}, {mannequinLabel})</li>
                <li className="text-purple-800">Customers who interact with mannequins are 2.3x more likely to make a purchase. (Current filter: {clientLabel}, {storeLabel}, {mannequinLabel})</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        {/* Robot Performance Tab */}
        <TabsContent value="robot">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg p-6 text-white shadow-lg mb-6">
            <h1 className="text-3xl font-bold mb-1 flex items-center gap-2">
              <Zap className="w-7 h-7 text-yellow-300 animate-pulse" />
              Robot Performance & Health
            </h1>
            <p className="text-blue-100 text-lg">Monitor your mannequins' technical status and reliability for {clientLabel}, {storeLabel}, {mannequinLabel}</p>
          </div>
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
                  <LineChart data={filteredUptimeData}>
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
                  <BarChart data={filteredMaintenanceData}>
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
                  <BarChart data={filteredUsageData}>
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
          <Card className="border-0 bg-gradient-to-br from-white to-blue-50 mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-blue-500 animate-bounce" />
                AI Technical Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="text-blue-800 font-medium">All mannequins are currently online and operational for {clientLabel}, {storeLabel}, {mannequinLabel}.</li>
                <li className="text-red-800">2 mannequins are due for maintenance in the next 2 weeks. (Current filter: {clientLabel}, {storeLabel}, {mannequinLabel})</li>
                <li className="text-purple-800">Average uptime this week: 98.7%. (Current filter: {clientLabel}, {storeLabel}, {mannequinLabel})</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        {/* Engagement Breakdown Tab */}
        <TabsContent value="engagement">
          <div className="bg-gradient-to-r from-pink-500 to-yellow-500 rounded-lg p-6 text-white shadow-lg mb-6">
            <h1 className="text-3xl font-bold mb-1 flex items-center gap-2">
              <Users className="w-7 h-7 text-yellow-300 animate-bounce" />
              Engagement Breakdown
            </h1>
            <p className="text-yellow-100 text-lg">Deep dive into how customers interact with your mannequins ({clientLabel}, {storeLabel}, {mannequinLabel})</p>
          </div>
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
                  <BarChart data={filteredUsageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="movements" fill="#ec4899" name="Engagements" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
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
                  <BarChart data={mannequins.slice(1).map((m, i) => ({ mannequin: m.name, engagement: 200 - i * 30 }))}>
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
          <Card className="border-0 bg-gradient-to-br from-white to-yellow-50 mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-500 animate-bounce" />
                AI Engagement Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="text-yellow-800 font-medium">Engagement peaks at 4pm, especially for MQ-005 and MQ-006. (Current filter: {clientLabel}, {storeLabel}, {mannequinLabel})</li>
                <li className="text-pink-800">Mannequins near store entrances see 2x more engagement. (Current filter: {clientLabel}, {storeLabel}, {mannequinLabel})</li>
                <li className="text-orange-800">Consider rotating mannequins to high-traffic areas for maximum impact. (Current filter: {clientLabel}, {storeLabel}, {mannequinLabel})</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        {/* Movement Analytics Tab */}
        <TabsContent value="movement">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg p-6 text-white shadow-lg mb-6">
            <h1 className="text-3xl font-bold mb-1 flex items-center gap-2">
              <Zap className="w-7 h-7 text-yellow-300 animate-pulse" />
              Movement Analytics
            </h1>
            <p className="text-indigo-100 text-lg">Analyze mannequin movement patterns and activity ({clientLabel}, {storeLabel}, {mannequinLabel})</p>
          </div>
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
                  <LineChart data={filteredUsageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="movements" stroke="#a21caf" strokeWidth={3} name="Movements" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
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
                  <BarChart data={mannequins.slice(1).map((m, i) => ({ mannequin: m.name, movements: 400 - i * 50 }))}>
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
          <Card className="border-0 bg-gradient-to-br from-white to-indigo-50 mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-indigo-500 animate-bounce" />
                AI Movement Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="text-indigo-800 font-medium">Saturday is the most active day for mannequin movements. (Current filter: {clientLabel}, {storeLabel}, {mannequinLabel})</li>
                <li className="text-purple-800">MQ-005 and MQ-006 are the most dynamic mannequins this week. (Current filter: {clientLabel}, {storeLabel}, {mannequinLabel})</li>
                <li className="text-blue-800">Try new movement presets to increase activity on slower days. (Current filter: {clientLabel}, {storeLabel}, {mannequinLabel})</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        {/* Advanced Insights Tab */}
        <TabsContent value="insights">
          <div className="bg-gradient-to-r from-green-400 to-blue-400 rounded-lg p-6 text-white shadow-lg mb-6">
            <h1 className="text-3xl font-bold mb-1 flex items-center gap-2">
              <Lightbulb className="w-7 h-7 text-yellow-300 animate-bounce" />
              Advanced Insights
            </h1>
            <p className="text-blue-100 text-lg">AI-driven recommendations and trends for your business ({clientLabel}, {storeLabel}, {mannequinLabel})</p>
          </div>
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
                  <LineChart data={filteredEngagementData}>
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
                      data={filteredConversionData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ action, value }) => `${action}: ${value}`}
                    >
                      {filteredConversionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 bg-gradient-to-br from-white to-blue-50 mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-blue-500 animate-bounce" />
                AI Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="text-green-800 font-medium">AI predicts a 15% increase in engagement during the summer months for {clientLabel}, {storeLabel}, {mannequinLabel}.</li>
                <li className="text-blue-800">Plan promotions around predicted spikes for maximum impact. (Current filter: {clientLabel}, {storeLabel}, {mannequinLabel})</li>
                <li className="text-purple-800">Watch for outlier events to quickly adapt your strategy. (Current filter: {clientLabel}, {storeLabel}, {mannequinLabel})</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 