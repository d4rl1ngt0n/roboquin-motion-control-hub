import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

export function AssignedMannequins() {
  const { user } = useAuth();

  // Mock data - replace with actual data fetching
  const assignedMannequins = [
    {
      id: '1',
      name: 'Mannequin 1',
      client: 'Client A',
      status: 'active',
      lastUpdate: '2 hours ago',
    },
    {
      id: '2',
      name: 'Mannequin 2',
      client: 'Client B',
      status: 'inactive',
      lastUpdate: '1 day ago',
    },
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Assigned Mannequins</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-semibold">Name</th>
                  <th className="text-left p-3 font-semibold">Client</th>
                  <th className="text-left p-3 font-semibold">Status</th>
                  <th className="text-left p-3 font-semibold">Last Update</th>
                  <th className="text-left p-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {assignedMannequins.map((mannequin) => (
                  <tr key={mannequin.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{mannequin.name}</td>
                    <td className="p-3">{mannequin.client}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        mannequin.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {mannequin.status}
                      </span>
                    </td>
                    <td className="p-3">{mannequin.lastUpdate}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 