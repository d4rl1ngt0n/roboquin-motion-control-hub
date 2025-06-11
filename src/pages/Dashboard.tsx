
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { Header } from '@/components/layout/Header';
import { Overview } from '@/components/dashboard/Overview';
import { MotionControl } from '@/components/motion/MotionControl';
import { DeviceManagement } from '@/components/devices/DeviceManagement';
import { Analytics } from '@/components/analytics/Analytics';
import { FirmwareUpdates } from '@/components/firmware/FirmwareUpdates';
import { MotionScheduler } from '@/components/scheduler/MotionScheduler';
import { UserManagement } from '@/components/users/UserManagement';
import { AlertsNotifications } from '@/components/alerts/AlertsNotifications';

export default function Dashboard() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6 overflow-auto">
            <Routes>
              <Route path="/" element={<Overview />} />
              <Route path="/motion" element={<MotionControl />} />
              <Route path="/devices" element={<DeviceManagement />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/firmware" element={<FirmwareUpdates />} />
              <Route path="/scheduler" element={<MotionScheduler />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/alerts" element={<AlertsNotifications />} />
            </Routes>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
