import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { MannequinAssignment } from '@/components/users/MannequinAssignment';
import { getMannequins, assignMannequin, Mannequin } from '@/api/mannequins';
import { toast } from 'sonner';

export function MannequinAssignmentPage() {
  const { user } = useAuth();
  const [mannequins, setMannequins] = useState<Mannequin[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMannequins();
  }, []);

  const loadMannequins = async () => {
    try {
      const data = await getMannequins();
      setMannequins(data);
    } catch (error) {
      toast.error('Failed to load mannequins');
      console.error('Error loading mannequins:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssign = async (mannequinId: string, userId: string | null) => {
    try {
      const updatedMannequin = await assignMannequin(mannequinId, userId);
      setMannequins(prev => 
        prev.map(m => m.id === updatedMannequin.id ? updatedMannequin : m)
      );
    } catch (error) {
      toast.error('Failed to update assignment');
      throw error; // Re-throw to let the component handle the error state
    }
  };

  if (!user || (user.role !== 'admin' && user.role !== 'manager')) {
    return (
      <div className="p-6">
        <div className="text-center text-red-600">
          You don't have permission to access this page.
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  // Get the list of users that can be assigned to mannequins
  // In a real app, this would come from an API
  const users = [
    {
      id: '1',
      name: 'Clara Client',
      email: 'client@demo.com',
      role: 'client' as const
    },
    {
      id: '2',
      name: 'John Doe',
      email: 'john@demo.com',
      role: 'client' as const
    }
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Mannequin Assignment</h1>
      <MannequinAssignment
        mannequins={mannequins}
        users={users}
        onAssign={handleAssign}
        currentUserRole={user.role}
      />
    </div>
  );
} 