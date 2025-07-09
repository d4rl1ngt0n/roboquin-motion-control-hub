import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Settings, Users as UsersIcon, Crown, UserCheck, UserX, Edit, Trash2, Shield, Mail, Phone, Building, Calendar, Lock, Unlock, Eye, EyeOff } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'client' | 'staff';
  status: 'active' | 'inactive' | 'pending';
  company?: string;
  phone?: string;
  createdAt: string;
  lastLogin?: string;
  assignedClients?: string[];
  permissions?: string[];
}

const accessLevels = [
  { value: 'hq', label: 'Headquarters' },
  { value: 'country', label: 'Country' },
  { value: 'regional', label: 'Regional' },
  { value: 'store', label: 'Store Level' },
];

const mockCountries = ['USA', 'UK', 'France', 'Germany'];
const mockRegions = ['North', 'South', 'East', 'West'];
const mockStores = ['Store A', 'Store B', 'Store C', 'Store D'];

const UserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('clients');
  const [showAddUser, setShowAddUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [addUserForm, setAddUserForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'manager',
    access: 'hq',
    countries: [] as string[],
    regions: [] as string[],
    stores: [] as string[],
    password: '',
    showPassword: false,
  });
  const [addUserError, setAddUserError] = useState('');

  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'John Admin',
      email: 'admin@roboquin.com',
      role: 'admin',
      status: 'active',
      company: 'RoboQuin Inc.',
      phone: '+1 (555) 123-4567',
      createdAt: '2024-01-15',
      lastLogin: '2024-03-20T10:30:00Z',
      permissions: ['all']
    },
    {
      id: '2',
      name: 'Sarah Manager',
      email: 'sarah@fashionstore.com',
      role: 'manager',
      status: 'active',
      company: 'Fashion Store Chain',
      phone: '+1 (555) 234-5678',
      createdAt: '2024-02-01',
      lastLogin: '2024-03-19T15:45:00Z',
      assignedClients: ['client1', 'client2'],
      permissions: ['manage_clients', 'view_analytics', 'schedule_motions']
    },
    {
      id: '3',
      name: 'Mike Client',
      email: 'mike@storea.com',
      role: 'client',
      status: 'active',
      company: 'Store A',
      phone: '+1 (555) 345-6789',
      createdAt: '2024-02-15',
      lastLogin: '2024-03-20T09:15:00Z',
      permissions: ['view_own_mannequins', 'basic_analytics']
    },
    {
      id: '4',
      name: 'Lisa Staff',
      email: 'lisa@storea.com',
      role: 'staff',
      status: 'active',
      company: 'Store A',
      phone: '+1 (555) 456-7890',
      createdAt: '2024-03-01',
      lastLogin: '2024-03-18T14:20:00Z',
      permissions: ['view_own_mannequins']
    }
  ]);

  const stats = [
    { label: 'Total Users', value: users.length.toString(), color: 'bg-blue-500' },
    { label: 'Admins', value: users.filter(u => u.role === 'admin').length.toString(), color: 'bg-purple-500' },
    { label: 'Managers', value: users.filter(u => u.role === 'manager').length.toString(), color: 'bg-green-500' },
    { label: 'Clients', value: users.filter(u => u.role === 'client').length.toString(), color: 'bg-orange-500' },
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.role.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'clients') return matchesSearch && user.role === 'client';
    if (activeTab === 'employees') return matchesSearch && (user.role === 'admin' || user.role === 'manager');
    
    return matchesSearch;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'manager': return 'bg-green-100 text-green-800';
      case 'client': return 'bg-orange-100 text-orange-800';
      case 'staff': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const elevateUser = (userId: string, newRole: 'admin' | 'manager') => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ));
  };

  const updateUserStatus = (userId: string, newStatus: 'active' | 'inactive' | 'pending') => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ));
  };

  const deleteUser = (userId: string) => {
    setSelectedUser(users.find(u => u.id === userId) || null);
    setShowDeleteDialog(true);
  };

  const handleAddUser = () => {
    if (!addUserForm.name || !addUserForm.email || !addUserForm.password) {
      setAddUserError('Name, email, and password are required.');
      return;
    }
    if (addUserForm.role === 'client') {
      setAddUserError('Client enrollment is reserved for managers.');
      return;
    }
    setUsers(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        name: addUserForm.name,
        email: addUserForm.email,
        phone: addUserForm.phone,
        role: addUserForm.role as 'admin' | 'manager',
        status: 'active',
        company: '',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        assignedClients: addUserForm.role === 'manager' ? [] : undefined,
        permissions: getDefaultPermissions(addUserForm.role),
      }
    ]);
    setShowAddUser(false);
    setAddUserForm({ name: '', email: '', phone: '', role: 'manager', access: 'hq', countries: [], regions: [], stores: [], password: '', showPassword: false });
    setAddUserError('');
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setAddUserForm({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      access: 'hq',
      countries: [],
      regions: [],
      stores: [],
      password: '',
      showPassword: false,
    });
    setShowEditDialog(true);
  };

  const handleFormSubmit = async (isEdit: boolean = false) => {
    if (!addUserForm.name.trim() || !addUserForm.email.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!isEdit && (!addUserForm.password || addUserForm.password !== addUserForm.confirmPassword)) {
      toast.error('Passwords do not match');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(addUserForm.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      if (isEdit && selectedUser) {
        // Update existing user
        const updatedUser: User = {
          ...selectedUser,
          name: addUserForm.name,
          email: addUserForm.email,
          phone: addUserForm.phone,
          role: addUserForm.role,
          status: addUserForm.status,
          company: addUserForm.company,
          permissions: getDefaultPermissions(addUserForm.role)
        };
        
        setUsers(prev => prev.map(u => 
          u.id === selectedUser.id ? updatedUser : u
        ));
        toast.success('User updated successfully');
        setShowEditDialog(false);
      } else {
        // Add new user
        const newUser: User = {
          id: Date.now().toString(),
          name: addUserForm.name,
          email: addUserForm.email,
          phone: addUserForm.phone,
          role: addUserForm.role,
          status: addUserForm.status,
          company: addUserForm.company,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          permissions: getDefaultPermissions(addUserForm.role)
        };
        
        setUsers(prev => [...prev, newUser]);
        toast.success('User added successfully');
        setShowAddUser(false);
      }
      
      setSelectedUser(null);
    } catch (error) {
      toast.error('Failed to save user');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;

    try {
      setUsers(prev => prev.filter(u => u.id !== selectedUser.id));
      toast.success('User deleted successfully');
      setShowDeleteDialog(false);
      setSelectedUser(null);
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const handlePasswordReset = (user: User) => {
    setSelectedUser(user);
    setShowPasswordModal(true);
  };

  const handlePasswordResetConfirm = async () => {
    if (!selectedUser) return;

    try {
      // Simulate password reset
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(`Password reset email sent to ${selectedUser.email}`);
      setShowPasswordModal(false);
      setSelectedUser(null);
    } catch (error) {
      toast.error('Failed to reset password');
    }
  };

  const getDefaultPermissions = (role: string): string[] => {
    switch (role) {
      case 'admin':
        return ['all'];
      case 'manager':
        return ['manage_clients', 'view_analytics', 'schedule_motions'];
      case 'client':
        return ['view_own_mannequins', 'basic_analytics'];
      case 'staff':
        return ['view_own_mannequins'];
      default:
        return [];
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-red-500">Admin</Badge>;
      case 'manager':
        return <Badge className="bg-blue-500">Manager</Badge>;
      case 'client':
        return <Badge className="bg-green-500">Client</Badge>;
      case 'staff':
        return <Badge className="bg-purple-500">Staff</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary" className="bg-gray-500">Inactive</Badge>;
      case 'pending':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-700">Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-4 w-4 text-red-500" />;
      case 'manager':
        return <UsersIcon className="h-4 w-4 text-blue-500" />;
      case 'client':
        return <Building className="h-4 w-4 text-green-500" />;
      case 'staff':
        return <UsersIcon className="h-4 w-4 text-purple-500" />;
      default:
        return <UsersIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600">Manage user accounts, roles, and access control</p>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${stat.color}`} />
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* User Management */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>System Users</CardTitle>
            <Button onClick={() => setShowAddUser(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search users by name, email, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="clients">Clients (Customers)</TabsTrigger>
              <TabsTrigger value="employees">Employees (Managers)</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <Card key={user.id} className={`${user.status === 'pending' ? 'border-yellow-200 bg-yellow-50' : user.status === 'inactive' ? 'border-gray-200 bg-gray-50' : ''}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-400 flex items-center justify-center text-white font-bold">
                              {user.name.charAt(0)}
                            </div>
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{user.name}</h3>
                            <p className="text-gray-600">{user.email}</p>
                            <div className="flex items-center gap-2 mt-1">
                              {getRoleBadge(user.role)}
                              {getStatusBadge(user.status)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {user.role === 'client' && (
                            <div className="text-sm text-gray-600">
                              <p>Mannequins: {user.assignedClients?.length || 0}</p>
                            </div>
                          )}
                          {user.role === 'manager' && (
                            <div className="text-sm text-gray-600">
                              <p>Clients: {user.assignedClients?.length || 0}</p>
                            </div>
                          )}
                          {user.role === 'manager' && user.phone && (
                            <div className="text-sm text-gray-600">
                              <span>Phone/WhatsApp: {user.phone}</span>
                            </div>
                          )}
                          
                          <div className="flex gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditUser(user)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            
                            {user.role === 'client' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => elevateUser(user.id, 'manager')}
                              >
                                <UserCheck className="w-4 h-4" />
                              </Button>
                            )}
                            
                            {user.status === 'active' ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateUserStatus(user.id, 'pending')}
                              >
                                <UserX className="w-4 h-4" />
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateUserStatus(user.id, 'active')}
                              >
                                <UserCheck className="w-4 h-4" />
                              </Button>
                            )}
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteUser(user.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and permissions
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <Input defaultValue={selectedUser.name} />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input defaultValue={selectedUser.email} />
              </div>
              <div>
                <label className="text-sm font-medium">Phone / WhatsApp</label>
                <Input defaultValue={selectedUser.phone || ''} />
              </div>
              <div>
                <label className="text-sm font-medium">Role</label>
                <Select defaultValue={selectedUser.role}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="client">Client</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Status</label>
                <Select defaultValue={selectedUser.status}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Company</label>
                <Input defaultValue={selectedUser.company} />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowEditDialog(false)}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add User</DialogTitle>
            <DialogDescription>
              Add a new admin or manager. Customer enrollment is reserved for managers.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <Input value={addUserForm.name} onChange={e => setAddUserForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input value={addUserForm.email} onChange={e => setAddUserForm(f => ({ ...f, email: e.target.value }))} placeholder="name@email.com"/>
            </div>
            <div>
              <label className="text-sm font-medium">Phone / WhatsApp</label>
              <Input value={addUserForm.phone} onChange={e => setAddUserForm(f => ({ ...f, phone: e.target.value }))} placeholder="e.g. +1 555 123 4567" />
            </div>
            <div>
              <label className="text-sm font-medium">Role</label>
              <Select value={addUserForm.role} onValueChange={val => setAddUserForm(f => ({ ...f, role: val }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="client">Client</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Level of Access</label>
              <Select value={addUserForm.access} onValueChange={val => setAddUserForm(f => ({ ...f, access: val }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {accessLevels.map(lvl => (
                    <SelectItem key={lvl.value} value={lvl.value}>{lvl.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Password</label>
              <div className="flex items-center gap-2">
                <Input
                  type={addUserForm.showPassword ? 'text' : 'password'}
                  value={addUserForm.password}
                  onChange={e => setAddUserForm(f => ({ ...f, password: e.target.value }))}
                />
                <Button type="button" variant="outline" size="sm" onClick={() => setAddUserForm(f => ({ ...f, showPassword: !f.showPassword }))}>
                  {addUserForm.showPassword ? 'Hide' : 'Show'}
                </Button>
              </div>
            </div>
            {/* Dynamic fields for access level */}
            {addUserForm.access === 'country' && (
              <div>
                <label className="text-sm font-medium">Countries Overseen</label>
                <select multiple className="w-full border rounded p-2" value={addUserForm.countries} onChange={e => {
                  const options = Array.from(e.target.selectedOptions).map(o => o.value);
                  setAddUserForm(f => ({ ...f, countries: options }));
                }}>
                  {mockCountries.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            )}
            {addUserForm.access === 'regional' && (
              <div>
                <label className="text-sm font-medium">Regions Overseen</label>
                <select multiple className="w-full border rounded p-2" value={addUserForm.regions} onChange={e => {
                  const options = Array.from(e.target.selectedOptions).map(o => o.value);
                  setAddUserForm(f => ({ ...f, regions: options }));
                }}>
                  {mockRegions.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            )}
            {addUserForm.access === 'store' && (
              <div>
                <label className="text-sm font-medium">Stores Overseen</label>
                <select multiple className="w-full border rounded p-2" value={addUserForm.stores} onChange={e => {
                  const options = Array.from(e.target.selectedOptions).map(o => o.value);
                  setAddUserForm(f => ({ ...f, stores: options }));
                }}>
                  {mockStores.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            )}
            {addUserError && <div className="text-red-600 text-sm">{addUserError}</div>}
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowAddUser(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddUser}>
                Add User
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedUser?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Password Reset Dialog */}
      <AlertDialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Password</AlertDialogTitle>
            <AlertDialogDescription>
              Send a password reset email to {selectedUser?.email}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handlePasswordResetConfirm}>
              Send Reset Email
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export { UserManagement };
