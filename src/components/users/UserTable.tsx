
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Settings, User } from 'lucide-react';

interface UserTableProps {
  searchTerm: string;
}

export function UserTable({ searchTerm }: UserTableProps) {
  const users = [
    {
      id: 1,
      name: 'John Admin',
      email: 'john@roboquin.com',
      role: 'admin',
      status: 'active',
      lastLogin: '2 hours ago',
      devices: 'All',
    },
    {
      id: 2,
      name: 'Sarah Engineer',
      email: 'sarah@roboquin.com',
      role: 'engineer',
      status: 'active',
      lastLogin: '1 day ago',
      devices: '24',
    },
    {
      id: 3,
      name: 'Mike Client',
      email: 'mike@fashionretailer.com',
      role: 'client',
      status: 'active',
      lastLogin: '3 hours ago',
      devices: '8',
    },
    {
      id: 4,
      name: 'Lisa Manager',
      email: 'lisa@trendyboutique.com',
      role: 'client',
      status: 'active',
      lastLogin: '1 hour ago',
      devices: '5',
    },
    {
      id: 5,
      name: 'Tom Engineer',
      email: 'tom@roboquin.com',
      role: 'engineer',
      status: 'inactive',
      lastLogin: '1 week ago',
      devices: '12',
    },
  ];

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-purple-100 text-purple-800">Admin</Badge>;
      case 'engineer':
        return <Badge className="bg-green-100 text-green-800">Engineer</Badge>;
      case 'client':
        return <Badge className="bg-blue-100 text-blue-800">Client</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    return status === 'active' 
      ? <Badge className="bg-green-100 text-green-800">Active</Badge>
      : <Badge className="bg-red-100 text-red-800">Inactive</Badge>;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left p-3 font-semibold">User</th>
            <th className="text-left p-3 font-semibold">Role</th>
            <th className="text-left p-3 font-semibold">Status</th>
            <th className="text-left p-3 font-semibold">Device Access</th>
            <th className="text-left p-3 font-semibold">Last Login</th>
            <th className="text-left p-3 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id} className="border-b hover:bg-gray-50">
              <td className="p-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-gray-600">{user.email}</div>
                  </div>
                </div>
              </td>
              <td className="p-3">
                {getRoleBadge(user.role)}
              </td>
              <td className="p-3">
                {getStatusBadge(user.status)}
              </td>
              <td className="p-3">
                <span className="text-sm">{user.devices} devices</span>
              </td>
              <td className="p-3">
                <span className="text-sm text-gray-600">{user.lastLogin}</span>
              </td>
              <td className="p-3">
                <div className="flex gap-1">
                  <Button size="sm" variant="outline">
                    <Settings className="h-3 w-3" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
