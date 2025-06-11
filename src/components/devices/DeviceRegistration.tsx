
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DeviceRegistrationProps {
  onClose: () => void;
}

export function DeviceRegistration({ onClose }: DeviceRegistrationProps) {
  const [formData, setFormData] = useState({
    deviceId: '',
    name: '',
    location: '',
    customer: '',
    ipAddress: '',
    macAddress: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Registering device:', formData);
    // TODO: Implement device registration API call
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Register New Mannequin Device</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="deviceId">Device ID</Label>
            <Input
              id="deviceId"
              placeholder="MQ-XXX"
              value={formData.deviceId}
              onChange={(e) => setFormData(prev => ({ ...prev, deviceId: e.target.value }))}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="name">Display Name</Label>
            <Input
              id="name"
              placeholder="Store A - Window Display"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="New York Store A"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="customer">Assign to Customer</Label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, customer: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select customer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fashion-retailer">Fashion Retailer Inc.</SelectItem>
                <SelectItem value="trendy-boutique">Trendy Boutique</SelectItem>
                <SelectItem value="urban-wear">Urban Wear Co.</SelectItem>
                <SelectItem value="luxury-fashion">Luxury Fashion</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="ipAddress">IP Address</Label>
            <Input
              id="ipAddress"
              placeholder="192.168.1.xxx"
              value={formData.ipAddress}
              onChange={(e) => setFormData(prev => ({ ...prev, ipAddress: e.target.value }))}
            />
          </div>
          
          <div>
            <Label htmlFor="macAddress">MAC Address</Label>
            <Input
              id="macAddress"
              placeholder="00:00:00:00:00:00"
              value={formData.macAddress}
              onChange={(e) => setFormData(prev => ({ ...prev, macAddress: e.target.value }))}
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">Register Device</Button>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
