import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';

export interface MannequinDetails {
  id: string;
  name: string;
  status: string;
  store?: string;
  location?: string;
  clientId?: string;
  battery?: number;
  lastSeen?: string;
  firmwareVersion?: string;
  lastActivity?: string;
}

interface MannequinDetailsModalProps {
  mannequin: MannequinDetails | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MannequinDetailsModal({ mannequin, open, onOpenChange }: MannequinDetailsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mannequin Details</DialogTitle>
        </DialogHeader>
        {mannequin && (
          <div className="space-y-2">
            <div><strong>ID:</strong> {mannequin.id}</div>
            <div><strong>Name:</strong> {mannequin.name}</div>
            <div><strong>Status:</strong> {mannequin.status}</div>
            {mannequin.store && <div><strong>Store:</strong> {mannequin.store}</div>}
            {mannequin.location && <div><strong>Location:</strong> {mannequin.location}</div>}
            {mannequin.clientId && <div><strong>Client ID:</strong> {mannequin.clientId}</div>}
            {mannequin.battery !== undefined && <div><strong>Battery:</strong> {mannequin.battery}%</div>}
            {mannequin.lastSeen && <div><strong>Last Seen:</strong> {mannequin.lastSeen}</div>}
            {mannequin.firmwareVersion && <div><strong>Firmware Version:</strong> {mannequin.firmwareVersion}</div>}
            {mannequin.lastActivity && <div><strong>Last Activity:</strong> {mannequin.lastActivity}</div>}
          </div>
        )}
        <DialogClose asChild>
          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">Close</button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
} 