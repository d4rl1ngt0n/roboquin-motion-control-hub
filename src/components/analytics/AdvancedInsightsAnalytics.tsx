import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, HeatMap, Legend } from 'recharts';

const COLORS = ['#2563eb', '#dc2626', '#16a34a', '#ca8a04', '#9333ea'];

export function AdvancedInsightsAnalytics({ selectedStore, selectedMannequin }) {
  // 1. Mannequin Engagement Heatmap (using a bar chart as a placeholder)
  let heatmapData = [
    { hour: '08:00', MQ001: 5, MQ002: 2, MQ003: 1, storeId: 'storeA' },
    { hour: '10:00', MQ001: 8, MQ002: 4, MQ003: 2, storeId: 'storeA' },
    { hour: '12:00', MQ001: 12, MQ002: 7, MQ003: 3, storeId: 'storeB' },
    { hour: '14:00', MQ001: 10, MQ002: 6, MQ003: 4, storeId: 'storeB' },
    { hour: '16:00', MQ001: 7, MQ002: 8, MQ003: 5, storeId: 'storeD' },
    { hour: '18:00', MQ001: 4, MQ002: 5, MQ003: 2, storeId: 'storeD' },
  ];

  // 2. Location/Zone Performance
  let locationData = [
    { location: 'Store A', engagement: 120, storeId: 'storeA' },
    { location: 'Store B', engagement: 95, storeId: 'storeB' },
    { location: 'Store D', engagement: 80, storeId: 'storeD' },
    { location: 'Store F', engagement: 60, storeId: 'storeF' },
  ];

  // 3. Preset/Movement Popularity Over Time
  let movementTrendData = [
    { date: 'Mon', Welcome: 20, Fashion: 15, Product: 10, storeId: 'storeA' },
    { date: 'Tue', Welcome: 25, Fashion: 18, Product: 12, storeId: 'storeA' },
    { date: 'Wed', Welcome: 30, Fashion: 20, Product: 15, storeId: 'storeB' },
    { date: 'Thu', Welcome: 28, Fashion: 22, Product: 18, storeId: 'storeB' },
    { date: 'Fri', Welcome: 35, Fashion: 25, Product: 20, storeId: 'storeD' },
    { date: 'Sat', Welcome: 40, Fashion: 30, Product: 25, storeId: 'storeD' },
    { date: 'Sun', Welcome: 38, Fashion: 28, Product: 22, storeId: 'storeF' },
  ];

  // 4. Alert & Issue Trends
  let alertTrendData = [
    { date: 'Mon', alerts: 2, issues: 1, storeId: 'storeA' },
    { date: 'Tue', alerts: 3, issues: 2, storeId: 'storeA' },
    { date: 'Wed', alerts: 1, issues: 0, storeId: 'storeB' },
    { date: 'Thu', alerts: 4, issues: 2, storeId: 'storeB' },
    { date: 'Fri', alerts: 2, issues: 1, storeId: 'storeD' },
    { date: 'Sat', alerts: 5, issues: 3, storeId: 'storeD' },
    { date: 'Sun', alerts: 3, issues: 1, storeId: 'storeF' },
  ];

  // 5. Customer Dwell Time
  let dwellTimeData = [
    { mannequin: 'MQ-001', dwell: 3.2, storeId: 'storeA' },
    { mannequin: 'MQ-002', dwell: 2.8, storeId: 'storeA' },
    { mannequin: 'MQ-003', dwell: 4.1, storeId: 'storeB' },
    { mannequin: 'MQ-004', dwell: 2.5, storeId: 'storeB' },
  ];

  // 6. Conversion/Action Rate
  let conversionData = [
    { action: 'QR Scan', value: 40, storeId: 'storeA' },
    { action: 'Purchase', value: 15, storeId: 'storeB' },
    { action: 'Info Request', value: 25, storeId: 'storeD' },
  ];

  // 7. Schedule Effectiveness
  let scheduleData = [
    { time: 'Scheduled', activity: 120, storeId: 'storeA' },
    { time: 'Unscheduled', activity: 45, storeId: 'storeB' },
  ];

  // 8. Device Health Overview
  let healthData = [
    { metric: 'Battery', value: 85, storeId: 'storeA' },
    { metric: 'Connectivity', value: 92, storeId: 'storeB' },
    { metric: 'Firmware', value: 78, storeId: 'storeD' },
  ];

  // 9. Custom Event Tracking
  let customEventData = [
    { event: 'Outfit Change', count: 12, storeId: 'storeA' },
    { event: 'Special Campaign', count: 7, storeId: 'storeB' },
    { event: 'Holiday Promo', count: 5, storeId: 'storeD' },
  ];

  // 10. Engagement by Demographics (if available)
  let demographicsData = [
    { group: '18-24', value: 30, storeId: 'storeA' },
    { group: '25-34', value: 45, storeId: 'storeB' },
    { group: '35-44', value: 20, storeId: 'storeD' },
    { group: '45+', value: 10, storeId: 'storeF' },
  ];

  // Filtering logic
  if (selectedStore && selectedStore !== 'all') {
    heatmapData = heatmapData.filter(d => d.storeId === selectedStore);
    locationData = locationData.filter(d => d.storeId === selectedStore);
    movementTrendData = movementTrendData.filter(d => d.storeId === selectedStore);
    alertTrendData = alertTrendData.filter(d => d.storeId === selectedStore);
    dwellTimeData = dwellTimeData.filter(d => d.storeId === selectedStore);
    conversionData = conversionData.filter(d => d.storeId === selectedStore);
    scheduleData = scheduleData.filter(d => d.storeId === selectedStore);
    healthData = healthData.filter(d => d.storeId === selectedStore);
    customEventData = customEventData.filter(d => d.storeId === selectedStore);
    demographicsData = demographicsData.filter(d => d.storeId === selectedStore);
  }
  if (selectedMannequin && selectedMannequin !== 'all') {
    // For heatmap, filter by mannequin columns
    heatmapData = heatmapData.map(row => {
      const filteredRow = { hour: row.hour };
      if (row[selectedMannequin]) filteredRow[selectedMannequin] = row[selectedMannequin];
      return filteredRow;
    });
    dwellTimeData = dwellTimeData.filter(d => d.mannequin === selectedMannequin);
  }

  return (
    <div className="space-y-6">
      {/* 1. Mannequin Engagement Heatmap */}
      <Card>
        <CardHeader><CardTitle>Mannequin Engagement Heatmap (by Hour)</CardTitle></CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={heatmapData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Legend />
                {/* Dynamically render bars for mannequins */}
                {selectedMannequin !== 'all' ? (
                  <Bar dataKey={selectedMannequin} fill="#2563eb" name={selectedMannequin} />
                ) : (
                  <>
                    <Bar dataKey="MQ001" fill="#2563eb" name="MQ-001" />
                    <Bar dataKey="MQ002" fill="#dc2626" name="MQ-002" />
                    <Bar dataKey="MQ003" fill="#16a34a" name="MQ-003" />
                  </>
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 2. Location/Zone Performance */}
      <Card>
        <CardHeader><CardTitle>Location/Zone Performance</CardTitle></CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={locationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="location" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="engagement" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 3. Preset/Movement Popularity Over Time */}
      <Card>
        <CardHeader><CardTitle>Movement Popularity Over Time</CardTitle></CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={movementTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Welcome" stroke="#2563eb" name="Welcome Gesture" />
                <Line type="monotone" dataKey="Fashion" stroke="#dc2626" name="Fashion Pose A" />
                <Line type="monotone" dataKey="Product" stroke="#16a34a" name="Product Showcase" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 4. Alert & Issue Trends */}
      <Card>
        <CardHeader><CardTitle>Alert & Issue Trends</CardTitle></CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={alertTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="alerts" stroke="#2563eb" name="Alerts" />
                <Line type="monotone" dataKey="issues" stroke="#dc2626" name="Issues" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 5. Customer Dwell Time */}
      <Card>
        <CardHeader><CardTitle>Customer Dwell Time (min)</CardTitle></CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dwellTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mannequin" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="dwell" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 6. Conversion/Action Rate */}
      <Card>
        <CardHeader><CardTitle>Conversion/Action Rate</CardTitle></CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={conversionData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ action, value }) => `${action}: ${value}`}
                >
                  {conversionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 7. Schedule Effectiveness */}
      <Card>
        <CardHeader><CardTitle>Schedule Effectiveness</CardTitle></CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scheduleData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="activity" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 8. Device Health Overview */}
      <Card>
        <CardHeader><CardTitle>Device Health Overview</CardTitle></CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={healthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="metric" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 9. Custom Event Tracking */}
      <Card>
        <CardHeader><CardTitle>Custom Event Tracking</CardTitle></CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={customEventData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="event" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 10. Engagement by Demographics */}
      <Card>
        <CardHeader><CardTitle>Engagement by Demographics</CardTitle></CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={demographicsData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ group, value }) => `${group}: ${value}`}
                >
                  {demographicsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 