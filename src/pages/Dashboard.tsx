import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { Header } from '@/components/layout/Header';
import { Overview, OverviewMannequin } from '@/components/dashboard/Overview';
import { MotionControl, Mannequin as MotionMannequin } from '@/components/motion/MotionControl';
import { DeviceManagement } from '@/components/devices/DeviceManagement';
import { Analytics } from '@/components/analytics/Analytics';
import { FirmwareUpdates } from '@/components/firmware/FirmwareUpdates';
import { MotionScheduler } from '@/components/scheduler/MotionScheduler';
import { UserManagement } from '@/components/users/UserManagement';
import { AlertsNotifications } from '@/components/alerts/AlertsNotifications';
import { MannequinList } from '@/components/client/MannequinList';
import { ClientAnalytics } from '@/components/analytics/ClientAnalytics';
import { ManagerAnalytics } from '@/components/analytics/ManagerAnalytics';
import { ClientSettings } from '@/components/client/ClientSettings';
import { AssignedMannequins } from '@/components/manager/AssignedMannequins';
import { ManagerSettings } from '@/components/manager/ManagerSettings';
import { useAuth } from '@/contexts/AuthContext';
import { MannequinAssignmentPage } from './MannequinAssignmentPage';
import PredictiveMaintenance from '@/components/maintenance/PredictiveMaintenance';
import DeviceAccessControl from '@/components/control/DeviceAccessControl';
import AdminDashboard from '@/components/admin/AdminDashboard';
import StaffChat from '@/components/chat/StaffChat';
import { CustomerChat } from '@/components/chat/CustomerChat';
import { VisualTrackingSystem } from '@/components/analytics/VisualTrackingSystem';
import { CameraAnalyticsDashboard } from '@/components/analytics';

// Define a unified Mannequin type that includes all required properties
interface Mannequin {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'maintenance';
  clientId: string;
  store: string;
  location: string;
  healthScore: number;
}

console.log('Dashboard loaded');

export default function Dashboard() {
  const { user } = useAuth();
  const location = useLocation();

  // Mock mannequin data with all required properties
  const allMannequins: Mannequin[] = [
    { id: 'MQ-001', name: 'Store A - Window Display', status: 'maintenance', clientId: '3', store: 'Store A', location: 'Window Display', healthScore: 42 },
    { id: 'MQ-002', name: 'Store A - Main Floor', status: 'maintenance', clientId: '3', store: 'Store A', location: 'Main Floor', healthScore: 38 },
    { id: 'MQ-003', name: 'Store B - Entrance', status: 'offline', clientId: '3', store: 'Store B', location: 'Entrance', healthScore: 45 },
    { id: 'MQ-004', name: 'Store B - VIP Section', status: 'online', clientId: '3', store: 'Store B', location: 'VIP Section', healthScore: 68 },
    { id: 'MQ-009', name: 'Store A - Fitting Room', status: 'online', clientId: '3', store: 'Store A', location: 'Fitting Room', healthScore: 92 },
    { id: 'MQ-010', name: 'Store B - Seasonal Corner', status: 'online', clientId: '3', store: 'Store B', location: 'Seasonal Corner', healthScore: 88 },
    { id: 'MQ-011', name: 'Store C - Premium Lounge', status: 'maintenance', clientId: '3', store: 'Store C', location: 'Premium Lounge', healthScore: 55 },
    { id: 'MQ-005', name: 'Store D - Seasonal Display', status: 'maintenance', clientId: 'client1', store: 'Store D', location: 'Seasonal Display', healthScore: 80 },
    { id: 'MQ-006', name: 'Store D - Fitting Area', status: 'online', clientId: 'client1', store: 'Store D', location: 'Fitting Area', healthScore: 90 },
    { id: 'MQ-007', name: 'Store F - Main Floor', status: 'online', clientId: 'client2', store: 'Store F', location: 'Main Floor', healthScore: 85 },
    { id: 'MQ-008', name: 'Store F - VIP Section', status: 'online', clientId: 'client2', store: 'Store F', location: 'VIP Section', healthScore: 87 },
  ];

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Client routes
  if (user.role === 'client') {
    const clientMannequins = allMannequins.filter(m => m.clientId === user.id);
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-background">
          <AppSidebar />
          <div className="flex-1 flex flex-col">
            <Header />
            <main className="flex-1 p-6 overflow-auto">
              <Routes>
                <Route path="/client/overview" element={<Overview mannequins={clientMannequins} showRegisteredUsersStat={false} />} />
                <Route path="/client/mannequins" element={<MannequinList mannequins={clientMannequins} />} />
                <Route path="/client/motion" element={<MotionControl mannequins={clientMannequins} />} />
                <Route path="/client/scheduler" element={<MotionScheduler mannequins={clientMannequins} />} />
                <Route path="/client/analytics" element={<ClientAnalytics />} />
                <Route path="/client/visual-tracking" element={<VisualTrackingSystem />} />
                <Route path="/client/camera-analytics" element={<CameraAnalyticsDashboard />} />
                <Route path="/client/settings" element={<ClientSettings />} />
                <Route path="/maintenance" element={<PredictiveMaintenance mannequins={clientMannequins} />} />
                <Route path="/chat" element={<CustomerChat mannequins={clientMannequins} />} />
                <Route path="*" element={<Navigate to="/dashboard/client/overview" replace />} />
              </Routes>
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  // Manager routes
  if (user.role === 'manager') {
    // For mock: assignedClients = ['client1', 'client2']
    const assignedClients = user.assignedClients || [];
    const mannequins = allMannequins.filter(m => assignedClients.includes(m.clientId));
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-background">
          <AppSidebar />
          <div className="flex-1 flex flex-col">
            <Header />
            <main className="flex-1 p-6 overflow-auto">
              <Routes>
                <Route path="/manager" element={<Overview mannequins={mannequins} showRegisteredUsersStat={false} />} />
                <Route path="/manager/mannequins" element={<AssignedMannequins />} />
                <Route path="/manager/motion" element={<MotionControl mannequins={mannequins} />} />
                <Route path="/manager/scheduler" element={<MotionScheduler mannequins={mannequins} />} />
                <Route path="/manager/analytics" element={<ManagerAnalytics />} />
                <Route path="/manager/settings" element={<ManagerSettings />} />
                <Route path="/manager/mannequin-assignment" element={<MannequinAssignmentPage />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/device-control" element={<DeviceAccessControl />} />
                <Route path="/staff/chat" element={<StaffChat />} />
                <Route path="*" element={<Navigate to="/dashboard/manager" replace />} />
              </Routes>
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  // Admin view (default)
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6 overflow-auto">
            <Routes>
              <Route path="/" element={<AdminDashboard />} />
              <Route path="/motion" element={<MotionControl mannequins={allMannequins} />} />
              <Route path="/device-control" element={<DeviceAccessControl />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/firmware" element={<FirmwareUpdates />} />
              <Route path="/scheduler" element={<MotionScheduler mannequins={allMannequins} />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/alerts" element={<AlertsNotifications />} />
              <Route path="/admin/mannequin-assignment" element={<MannequinAssignmentPage />} />
              <Route path="/maintenance" element={<PredictiveMaintenance />} />
              <Route path="/staff/chat" element={<StaffChat />} />
            </Routes>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
