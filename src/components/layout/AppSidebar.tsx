import { NavLink, useLocation } from 'react-router-dom';
import {
  Home, Settings, Monitor, Database, Activity, Calendar, Users, Bell, ChevronLeft, ChevronRight, LogOut,
  Wrench, Shield, MessageSquare, BarChart3, Zap, Image
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
  useSidebar,
} from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const adminNavigationItems = [
  { title: 'Admin Dashboard', url: '/dashboard', icon: BarChart3 },
  { title: 'Device Control', url: '/dashboard/device-control', icon: Shield },
  { title: 'Predictive Maintenance', url: '/dashboard/maintenance', icon: Wrench },
  { title: 'Motion Control', url: '/dashboard/motion', icon: Settings },
  { title: 'Analytics', url: '/dashboard/analytics', icon: Activity },
  { title: 'Firmware Updates', url: '/dashboard/firmware', icon: Database },
  { title: 'Motion Scheduler', url: '/dashboard/scheduler', icon: Calendar },
  { title: 'User Management', url: '/dashboard/users', icon: Users },
  { title: 'Alerts & Notifications', url: '/dashboard/alerts', icon: Bell }
];

const clientNavigationItems = [
  { title: 'Overview', url: '/dashboard/client/overview', icon: Home },
  { title: 'Predictive Maintenance', url: '/dashboard/maintenance', icon: Wrench },
  { title: 'Customer Chat', url: '/dashboard/chat', icon: MessageSquare },
  { title: 'My Mannequins', url: '/dashboard/client/mannequins', icon: Monitor },
  { title: 'Motion Control', url: '/dashboard/client/motion', icon: Settings },
  { title: 'Motion Scheduler', url: '/dashboard/client/scheduler', icon: Calendar },
  { title: 'Analytics', url: '/dashboard/client/analytics', icon: Activity },
  { title: 'Visual Tracking', url: '/dashboard/client/visual-tracking', icon: Image },
  { title: 'Camera Analytics', url: '/dashboard/client/camera-analytics', icon: Activity },
  { title: 'Settings', url: '/dashboard/client/settings', icon: Settings },
];

const managerNavigationItems = [
  { title: 'Overview', url: '/dashboard/manager', icon: Home },
  { title: 'Device Control', url: '/dashboard/admin/device-control', icon: Shield },
  { title: 'Staff Chat', url: '/dashboard/staff/chat', icon: MessageSquare },
  { title: 'Assigned Mannequins', url: '/dashboard/manager/mannequins', icon: Monitor },
  { title: 'Motion Control', url: '/dashboard/manager/motion', icon: Settings },
  { title: 'Motion Scheduler', url: '/dashboard/manager/scheduler', icon: Calendar },
  { title: 'Client Analytics', url: '/dashboard/manager/analytics', icon: Activity },
  { title: 'Settings', url: '/dashboard/manager/settings', icon: Settings }
];

const mockUsers = [
  // ...
  {
    id: '3',
    name: 'Clara Client',
    email: 'client@demo.com',
    role: 'client',
  },
];

export function AppSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const location = useLocation();
  const { user } = useAuth();
  const isCollapsed = state === "collapsed";

  // Example avatar (replace with your logo or user avatar)
  const avatar = (
    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-400 text-white font-bold text-lg shadow">
      RQ
    </div>
  );

  let navigationItems = adminNavigationItems;
  if (user?.role === 'client') navigationItems = clientNavigationItems;
  if (user?.role === 'manager') navigationItems = managerNavigationItems;

  // Group navigation items by category
  const groupedItems = {
    main: navigationItems.filter(item => 
      ['Overview', 'My Mannequins', 'Assigned Mannequins', 'Admin Dashboard'].includes(item.title)
    ),
    motion: navigationItems.filter(item => 
      ['Motion Control', 'Motion Scheduler'].includes(item.title)
    ),
    management: navigationItems.filter(item => 
      ['User Management', 'Settings', 'Device Control', 'Predictive Maintenance'].includes(item.title)
    ),
    communication: navigationItems.filter(item => 
      ['Customer Chat', 'Staff Chat'].includes(item.title)
    ),
    other: navigationItems.filter(item => 
      !['Overview', 'My Mannequins', 'Assigned Mannequins', 'Admin Dashboard', 'Motion Control', 'Motion Scheduler', 'User Management', 'Settings', 'Device Control', 'Predictive Maintenance', 'Customer Chat', 'Staff Chat'].includes(item.title)
    )
  };

  return (
    <Sidebar
      className={cn(
        "bg-white border-r shadow-xl rounded-r-2xl transition-all duration-300",
        isCollapsed ? 'w-20' : 'w-64'
      )}
      collapsible="icon"
    >
      {/* Branding */}
      <div className="flex items-center gap-3 px-4 py-6 border-b">
        {avatar}
        {!isCollapsed && (
          <span className="ml-2 text-xl font-extrabold tracking-tight text-blue-700">RoboQuin Hub</span>
        )}
        <button
          onClick={toggleSidebar}
          className="ml-auto p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5 text-gray-600" />
          ) : (
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          )}
        </button>
      </div>

      <SidebarContent className="bg-white flex flex-col h-full">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-2 mb-1">
            Main
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {groupedItems.main.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-3 px-4 py-2.5 rounded-lg group transition-all duration-200 font-medium",
                          isActive
                            ? "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow"
                            : "text-gray-600 hover:bg-gray-50 hover:text-blue-700",
                          isCollapsed && "justify-center px-2"
                        )
                      }
                      title={isCollapsed ? item.title : undefined}
                    >
                      <item.icon className={cn(
                        "h-5 w-5 transition-colors",
                        location.pathname === item.url ? "text-blue-700" : "text-gray-400 group-hover:text-blue-700"
                      )} />
                      {!isCollapsed && (
                        <span className="text-base">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Motion Control Group */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-4 mb-1">
            Motion
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {groupedItems.motion.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-3 px-4 py-2.5 rounded-lg group transition-all duration-200 font-medium",
                          isActive
                            ? "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow"
                            : "text-gray-600 hover:bg-gray-50 hover:text-blue-700",
                          isCollapsed && "justify-center px-2"
                        )
                      }
                      title={isCollapsed ? item.title : undefined}
                    >
                      <item.icon className={cn(
                        "h-5 w-5 transition-colors",
                        location.pathname === item.url ? "text-blue-700" : "text-gray-400 group-hover:text-blue-700"
                      )} />
                      {!isCollapsed && (
                        <span className="text-base">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Management Group */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-4 mb-1">
            Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {groupedItems.management.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-3 px-4 py-2.5 rounded-lg group transition-all duration-200 font-medium",
                          isActive
                            ? "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow"
                            : "text-gray-600 hover:bg-gray-50 hover:text-blue-700",
                          isCollapsed && "justify-center px-2"
                        )
                      }
                      title={isCollapsed ? item.title : undefined}
                    >
                      <item.icon className={cn(
                        "h-5 w-5 transition-colors",
                        location.pathname === item.url ? "text-blue-700" : "text-gray-400 group-hover:text-blue-700"
                      )} />
                      {!isCollapsed && (
                        <span className="text-base">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Communication Group */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-4 mb-1">
            Communication
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {groupedItems.communication.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-3 px-4 py-2.5 rounded-lg group transition-all duration-200 font-medium",
                          isActive
                            ? "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow"
                            : "text-gray-600 hover:bg-gray-50 hover:text-blue-700",
                          isCollapsed && "justify-center px-2"
                        )
                      }
                      title={isCollapsed ? item.title : undefined}
                    >
                      <item.icon className={cn(
                        "h-5 w-5 transition-colors",
                        location.pathname === item.url ? "text-blue-700" : "text-gray-400 group-hover:text-blue-700"
                      )} />
                      {!isCollapsed && (
                        <span className="text-base">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Other Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-4 mb-1">
            Other
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {groupedItems.other.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-3 px-4 py-2.5 rounded-lg group transition-all duration-200 font-medium",
                          isActive
                            ? "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow"
                            : "text-gray-600 hover:bg-gray-50 hover:text-blue-700",
                          isCollapsed && "justify-center px-2"
                        )
                      }
                      title={isCollapsed ? item.title : undefined}
                    >
                      <item.icon className={cn(
                        "h-5 w-5 transition-colors",
                        location.pathname === item.url ? "text-blue-700" : "text-gray-400 group-hover:text-blue-700"
                      )} />
                      {!isCollapsed && (
                        <span className="text-base">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Divider */}
        <div className="my-4 border-t border-gray-100" />

        {/* User Profile & Logout */}
        <div className="flex-1 flex flex-col justify-end pb-6 px-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
              {user?.name?.[0] || "U"}
            </div>
            {!isCollapsed && (
              <div>
                <div className="font-semibold text-gray-800">{user?.name || "User"}</div>
                <div className="text-xs text-gray-400">{user?.email}</div>
              </div>
            )}
            <button
              className={cn(
                "ml-auto p-2 rounded-lg hover:bg-gray-100 transition-colors",
                isCollapsed && "mx-auto"
              )}
              title="Logout"
              // onClick={logout} // implement your logout logic
            >
              <LogOut className="h-5 w-5 text-gray-400" />
            </button>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
