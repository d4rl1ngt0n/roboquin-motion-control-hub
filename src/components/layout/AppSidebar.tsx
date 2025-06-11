
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  Settings, 
  Monitor, 
  Database, 
  Activity, 
  Calendar, 
  Users, 
  Bell 
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';

const navigationItems = [
  { title: 'Overview', url: '/dashboard', icon: Home },
  { title: 'Motion Control', url: '/dashboard/motion', icon: Settings },
  { title: 'Device Management', url: '/dashboard/devices', icon: Monitor },
  { title: 'Analytics', url: '/dashboard/analytics', icon: Activity },
  { title: 'Firmware Updates', url: '/dashboard/firmware', icon: Database },
  { title: 'Motion Scheduler', url: '/dashboard/scheduler', icon: Calendar },
  { title: 'User Management', url: '/dashboard/users', icon: Users },
  { title: 'Alerts & Notifications', url: '/dashboard/alerts', icon: Bell },
];

export function AppSidebar() {
  const { collapsed } = useSidebar();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar className={collapsed ? 'w-14' : 'w-64'} collapsible>
      <SidebarTrigger className="m-2 self-end" />
      
      <SidebarContent className="bg-slate-900">
        <div className="p-4">
          <h2 className={`font-bold text-white ${collapsed ? 'hidden' : 'text-lg'}`}>
            RoboQuin Hub
          </h2>
        </div>
        
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-400">Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={({ isActive }) => 
                        `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                          isActive 
                            ? 'bg-blue-600 text-white' 
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`
                      }
                    >
                      <item.icon className="h-5 w-5" />
                      {!collapsed && <span className="text-sm">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
