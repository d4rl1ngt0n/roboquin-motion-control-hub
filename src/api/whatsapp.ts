import { Mannequin } from '@/components/motion/MotionControl';

interface WhatsAppCommand {
  mannequinId: string;
  command: string;
  preset?: string;
}

export async function handleWhatsAppCommand(message: string, userPhone: string): Promise<string> {
  // Parse the command
  const parts = message.trim().split(' ');
  const command = parts[0].toLowerCase();
  
  // Get user's mannequins based on their phone number
  const userMannequins = await getUserMannequins(userPhone);
  
  if (command === '/help') {
    return `Available commands:
/move [mannequin_id] [preset_name] - Run a motion preset
/status [mannequin_id] - Check mannequin status
/help - Show this help message

Your mannequins: ${userMannequins.map(m => m.id).join(', ')}`;
  }
  
  if (command === '/move' && parts.length === 3) {
    const mannequinId = parts[1];
    const preset = parts[2];
    
    // Verify mannequin belongs to user
    if (!userMannequins.find(m => m.id === mannequinId)) {
      return 'Error: You do not have access to this mannequin';
    }
    
    try {
      await executeMotionPreset(mannequinId, preset);
      return `Executing preset "${preset}" on mannequin ${mannequinId}`;
    } catch (error) {
      return `Error executing preset: ${error.message}`;
    }
  }
  
  if (command === '/status' && parts.length === 2) {
    const mannequinId = parts[1];
    
    // Verify mannequin belongs to user
    if (!userMannequins.find(m => m.id === mannequinId)) {
      return 'Error: You do not have access to this mannequin';
    }
    
    const status = await getMannequinStatus(mannequinId);
    return `Mannequin ${mannequinId} status:
Status: ${status.status}
Battery: ${status.battery}%
Last seen: ${status.lastSeen}`;
  }
  
  return 'Invalid command. Type /help for available commands';
}

async function getUserMannequins(phone: string): Promise<Mannequin[]> {
  // TODO: Implement actual database query
  // For now, return mock data
  return [
    { id: 'MQ-001', name: 'Store A - Window Display', status: 'online' },
    { id: 'MQ-002', name: 'Store A - Main Floor', status: 'online' },
  ];
}

async function executeMotionPreset(mannequinId: string, preset: string): Promise<void> {
  // TODO: Implement actual motion control
  console.log(`Executing preset ${preset} on mannequin ${mannequinId}`);
}

async function getMannequinStatus(mannequinId: string): Promise<any> {
  // TODO: Implement actual status check
  return {
    status: 'online',
    battery: 85,
    lastSeen: new Date().toISOString(),
  };
} 