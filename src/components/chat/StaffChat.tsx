import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Send, Users, Shield } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: Date;
  type: 'user' | 'system' | 'admin';
}

const StaffChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'System',
      message: 'Welcome to RoboQuin Staff Chat. How can we help you today?',
      timestamp: new Date(),
      type: 'system'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      sender: 'You',
      message: newMessage,
      timestamp: new Date(),
      type: 'user'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate response
    setTimeout(() => {
      const response: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'Support Team',
        message: 'Thank you for your message. A team member will respond shortly.',
        timestamp: new Date(),
        type: 'admin'
      };
      setMessages(prev => [...prev, response]);
    }, 1000);
  };

  const getMessageStyle = (type: string) => {
    switch (type) {
      case 'user':
        return 'bg-blue-100 text-blue-900 ml-auto';
      case 'admin':
        return 'bg-green-100 text-green-900';
      case 'system':
        return 'bg-gray-100 text-gray-900';
      default:
        return 'bg-gray-100 text-gray-900';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Staff Chat</h2>
          <p className="text-gray-600">Internal communication and support</p>
        </div>
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          <Shield className="w-4 h-4 mr-1" />
          Staff Only
        </Badge>
      </div>

      {/* Chat Interface */}
      <Card className="h-[600px] flex flex-col">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            Staff Communication
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages Area */}
          <div className="flex-1 p-4 space-y-3 overflow-y-auto">
            {messages.map((message) => (
              <div key={message.id} className={`max-w-xs p-3 rounded-lg ${getMessageStyle(message.type)}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm">{message.sender}</span>
                  <span className="text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm">{message.message}</p>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-1"
              />
              <Button onClick={sendMessage} size="sm">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffChat; 