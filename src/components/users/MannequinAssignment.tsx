import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, UserPlus, UserMinus } from 'lucide-react';
import { toast } from 'sonner';

interface Mannequin {
  id: string;
  name: string;
  status: string;
  clientId: string | null;
  store: string;
  location: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'client' | 'manager';
}

interface MannequinAssignmentProps {
  mannequins: Mannequin[];
  users: User[];
  onAssign: (mannequinId: string, userId: string | null) => Promise<void>;
  currentUserRole: 'admin' | 'manager';
}

export function MannequinAssignment({ mannequins, users, onAssign, currentUserRole }: MannequinAssignmentProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMannequin, setSelectedMannequin] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);

  // Filter users based on role (only show clients for assignment)
  const assignableUsers = users.filter(user => user.role === 'client');

  // Filter mannequins based on search term
  const filteredMannequins = mannequins.filter(mannequin =>
    mannequin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mannequin.store.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mannequin.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAssign = async () => {
    if (!selectedMannequin) {
      toast.error('Please select a mannequin');
      return;
    }

    setIsAssigning(true);
    try {
      await onAssign(selectedMannequin, selectedUser);
      toast.success('Assignment updated successfully');
      setSelectedMannequin(null);
      setSelectedUser(null);
    } catch (error) {
      toast.error('Failed to update assignment');
    } finally {
      setIsAssigning(false);
    }
  };

  const handleUnassign = async (mannequinId: string) => {
    setIsAssigning(true);
    try {
      await onAssign(mannequinId, null);
      toast.success('Mannequin unassigned successfully');
    } catch (error) {
      toast.error('Failed to unassign mannequin');
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Assign Mannequins to Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search and Filter */}
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="search">Search Mannequins</Label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    id="search"
                    placeholder="Search by name, store, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
            </div>

            {/* Assignment Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="mannequin">Select Mannequin</Label>
                <Select
                  value={selectedMannequin || ''}
                  onValueChange={setSelectedMannequin}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a mannequin" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredMannequins.map((mannequin) => (
                      <SelectItem key={mannequin.id} value={mannequin.id}>
                        {mannequin.name} ({mannequin.store})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="user">Assign to User</Label>
                <Select
                  value={selectedUser || ''}
                  onValueChange={setSelectedUser}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a user" />
                  </SelectTrigger>
                  <SelectContent>
                    {assignableUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              onClick={handleAssign}
              disabled={!selectedMannequin || !selectedUser || isAssigning}
              className="w-full"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              {isAssigning ? 'Assigning...' : 'Assign Mannequin'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Current Assignments */}
      <Card>
        <CardHeader>
          <CardTitle>Current Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredMannequins.map((mannequin) => {
              const assignedUser = users.find(u => u.id === mannequin.clientId);
              return (
                <div key={mannequin.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">{mannequin.name}</div>
                    <div className="text-sm text-gray-500">
                      {mannequin.store} - {mannequin.location}
                    </div>
                    <div className="mt-1">
                      <Badge variant={mannequin.status === 'online' ? 'default' : 'secondary'}>
                        {mannequin.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {assignedUser ? (
                      <>
                        <div className="text-sm">
                          <div className="font-medium">Assigned to:</div>
                          <div className="text-gray-500">{assignedUser.name}</div>
                          <div className="text-gray-400 text-xs">{assignedUser.email}</div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUnassign(mannequin.id)}
                          disabled={isAssigning}
                        >
                          <UserMinus className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <div className="text-sm text-gray-500">Unassigned</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 