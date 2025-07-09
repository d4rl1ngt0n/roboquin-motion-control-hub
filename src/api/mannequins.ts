import { toast } from 'sonner';

export interface Mannequin {
  id: string;
  name: string;
  status: string;
  clientId: string | null;
  store: string;
  location: string;
}

// Mock data - in a real app, this would come from a backend
let mannequins: Mannequin[] = [
  {
    id: '1',
    name: 'Mannequin 1',
    status: 'online',
    clientId: '1', // Assigned to Clara Client
    store: 'Fashion Store A',
    location: 'Floor 1'
  },
  {
    id: '2',
    name: 'Mannequin 2',
    status: 'offline',
    clientId: null,
    store: 'Fashion Store B',
    location: 'Floor 2'
  },
  {
    id: '3',
    name: 'Mannequin 3',
    status: 'online',
    clientId: '2', // Assigned to another client
    store: 'Fashion Store A',
    location: 'Floor 3'
  }
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getMannequins = async (): Promise<Mannequin[]> => {
  await delay(500); // Simulate network delay
  return [...mannequins];
};

export const assignMannequin = async (mannequinId: string, userId: string | null): Promise<Mannequin> => {
  await delay(500); // Simulate network delay
  
  const mannequinIndex = mannequins.findIndex(m => m.id === mannequinId);
  if (mannequinIndex === -1) {
    throw new Error('Mannequin not found');
  }

  // Update the mannequin's assignment
  mannequins[mannequinIndex] = {
    ...mannequins[mannequinIndex],
    clientId: userId
  };

  return mannequins[mannequinIndex];
};

export const getMannequinsByClient = async (clientId: string): Promise<Mannequin[]> => {
  await delay(500); // Simulate network delay
  return mannequins.filter(m => m.clientId === clientId);
};

export const getMannequinsByManager = async (managerId: string, assignedClientIds: string[]): Promise<Mannequin[]> => {
  await delay(500); // Simulate network delay
  return mannequins.filter(m => m.clientId && assignedClientIds.includes(m.clientId));
}; 