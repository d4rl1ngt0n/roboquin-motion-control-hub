import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Power, 
  PowerOff, 
  Settings, 
  MapPin, 
  Wifi, 
  WifiOff,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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

interface Mannequin {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'maintenance';
  clientId: string;
  store: string;
  location: string;
  healthScore: number;
  lastSeen?: string;
  firmwareVersion?: string;
  ipAddress?: string;
}

interface MannequinListProps {
  mannequins: Mannequin[];
}

export function MannequinList({ mannequins }: MannequinListProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [selectedMannequin, setSelectedMannequin] = useState<Mannequin | null>(null);
  const [mannequinList, setMannequinList] = useState<Mannequin[]>(mannequins);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    store: '',
    location: '',
    status: 'online' as const,
    ipAddress: '',
    firmwareVersion: '1.2.0'
  });

  const handleAddMannequin = () => {
    setFormData({
      name: '',
      store: '',
      location: '',
      status: 'online',
      ipAddress: '',
      firmwareVersion: '1.2.0'
    });
    setShowAddModal(true);
  };

  const handleEditMannequin = (mannequin: Mannequin) => {
    setSelectedMannequin(mannequin);
    setFormData({
      name: mannequin.name,
      store: mannequin.store,
      location: mannequin.location,
      status: mannequin.status,
      ipAddress: mannequin.ipAddress || '',
      firmwareVersion: mannequin.firmwareVersion || '1.2.0'
    });
    setShowEditModal(true);
  };

  const handleDeleteMannequin = (mannequin: Mannequin) => {
    setSelectedMannequin(mannequin);
    setShowDeleteDialog(true);
  };

  const handleStatusChange = (mannequin: Mannequin) => {
    setSelectedMannequin(mannequin);
    setShowStatusDialog(true);
  };

  const handleFormSubmit = async (isEdit: boolean = false) => {
    if (!formData.name.trim() || !formData.store.trim() || !formData.location.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (isEdit && selectedMannequin) {
        // Update existing mannequin
        const updatedMannequin: Mannequin = {
          ...selectedMannequin,
          ...formData,
          lastSeen: new Date().toISOString()
        };
        
        setMannequinList(prev => prev.map(m => 
          m.id === selectedMannequin.id ? updatedMannequin : m
        ));
        toast.success('Mannequin updated successfully');
        setShowEditModal(false);
      } else {
        // Add new mannequin
        const newMannequin: Mannequin = {
          id: `MQ-${Date.now()}`,
          ...formData,
          clientId: '3', // Mock client ID
          healthScore: 100,
          lastSeen: new Date().toISOString()
        };
        
        setMannequinList(prev => [...prev, newMannequin]);
        toast.success('Mannequin added successfully');
        setShowAddModal(false);
      }
      
      setSelectedMannequin(null);
    } catch (error) {
      toast.error('Failed to save mannequin');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedMannequin) return;

    try {
      setMannequinList(prev => prev.filter(m => m.id !== selectedMannequin.id));
      toast.success('Mannequin deleted successfully');
      setShowDeleteDialog(false);
      setSelectedMannequin(null);
    } catch (error) {
      toast.error('Failed to delete mannequin');
    }
  };

  const handleStatusConfirm = async (newStatus: 'online' | 'offline' | 'maintenance') => {
    if (!selectedMannequin) return;

    try {
      const updatedMannequin: Mannequin = {
        ...selectedMannequin,
        status: newStatus,
        lastSeen: newStatus === 'online' ? new Date().toISOString() : selectedMannequin.lastSeen
      };
      
      setMannequinList(prev => prev.map(m => 
        m.id === selectedMannequin.id ? updatedMannequin : m
      ));
      toast.success(`Mannequin status changed to ${newStatus}`);
      setShowStatusDialog(false);
      setSelectedMannequin(null);
    } catch (error) {
      toast.error('Failed to update mannequin status');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <Wifi className="h-4 w-4 text-green-500" />;
      case 'offline':
        return <WifiOff className="h-4 w-4 text-red-500" />;
      case 'maintenance':
        return <Settings className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online':
        return <Badge className="bg-green-500">Online</Badge>;
      case 'offline':
        return <Badge variant="secondary" className="bg-red-500">Offline</Badge>;
      case 'maintenance':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-700">Maintenance</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mannequin Management</h1>
          <p className="text-gray-600">Manage your store mannequins and their settings</p>
        </div>
        <Button onClick={handleAddMannequin} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Mannequin
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mannequinList.map((mannequin) => (
          <Card key={mannequin.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(mannequin.status)}
                  <CardTitle className="text-lg">{mannequin.name}</CardTitle>
                </div>
                {getStatusBadge(mannequin.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{mannequin.store} - {mannequin.location}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Health Score:</span>
                  <span className={`font-semibold ${getHealthScoreColor(mannequin.healthScore)}`}>
                    {mannequin.healthScore}%
                  </span>
                </div>

                {mannequin.lastSeen && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>Last seen: {new Date(mannequin.lastSeen).toLocaleString()}</span>
                  </div>
                )}

                {mannequin.ipAddress && (
                  <div className="text-sm text-gray-600">
                    IP: {mannequin.ipAddress}
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditMannequin(mannequin)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusChange(mannequin)}
                  className="flex-1"
                >
                  {mannequin.status === 'online' ? (
                    <PowerOff className="h-4 w-4 mr-1" />
                  ) : (
                    <Power className="h-4 w-4 mr-1" />
                  )}
                  {mannequin.status === 'online' ? 'Disable' : 'Enable'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteMannequin(mannequin)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Mannequin Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Mannequin</DialogTitle>
            <DialogDescription>
              Add a new mannequin to your store network.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Mannequin Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Window Display M1"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="store">Store *</Label>
              <Input
                id="store"
                value={formData.store}
                onChange={(e) => setFormData({ ...formData, store: e.target.value })}
                placeholder="e.g., Store A"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Window Display"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="ip">IP Address</Label>
              <Input
                id="ip"
                value={formData.ipAddress}
                onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
                placeholder="192.168.1.100"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="firmware">Firmware Version</Label>
              <Input
                id="firmware"
                value={formData.firmwareVersion}
                onChange={(e) => setFormData({ ...formData, firmwareVersion: e.target.value })}
                placeholder="1.2.0"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => handleFormSubmit(false)}>
              Add Mannequin
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Mannequin Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Mannequin</DialogTitle>
            <DialogDescription>
              Update mannequin settings and configuration.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Mannequin Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Window Display M1"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-store">Store *</Label>
              <Input
                id="edit-store"
                value={formData.store}
                onChange={(e) => setFormData({ ...formData, store: e.target.value })}
                placeholder="e.g., Store A"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-location">Location *</Label>
              <Input
                id="edit-location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Window Display"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-ip">IP Address</Label>
              <Input
                id="edit-ip"
                value={formData.ipAddress}
                onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
                placeholder="192.168.1.100"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-firmware">Firmware Version</Label>
              <Input
                id="edit-firmware"
                value={formData.firmwareVersion}
                onChange={(e) => setFormData({ ...formData, firmwareVersion: e.target.value })}
                placeholder="1.2.0"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => handleFormSubmit(true)}>
              Update Mannequin
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Mannequin</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedMannequin?.name}"? This action cannot be undone.
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

      {/* Status Change Dialog */}
      <AlertDialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change Mannequin Status</AlertDialogTitle>
            <AlertDialogDescription>
              Select the new status for "{selectedMannequin?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid gap-2 py-4">
            <Button
              variant="outline"
              onClick={() => handleStatusConfirm('online')}
              className="justify-start"
            >
              <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
              Online - Fully operational
            </Button>
            <Button
              variant="outline"
              onClick={() => handleStatusConfirm('offline')}
              className="justify-start"
            >
              <PowerOff className="h-4 w-4 mr-2 text-red-600" />
              Offline - Disabled
            </Button>
            <Button
              variant="outline"
              onClick={() => handleStatusConfirm('maintenance')}
              className="justify-start"
            >
              <Settings className="h-4 w-4 mr-2 text-yellow-600" />
              Maintenance - Under repair
            </Button>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 