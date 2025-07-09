import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Search, 
  Filter, 
  Plus, 
  MessageSquare, 
  Users, 
  Clock, 
  TrendingUp,
  Star,
  MoreVertical,
  Phone,
  Video,
  Mail
} from 'lucide-react';
import ChatInterface from './ChatInterface';

interface Customer {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: 'online' | 'offline' | 'away';
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  priority: 'high' | 'medium' | 'low';
  tags: string[];
}

interface Conversation {
  id: string;
  customerId: string;
  customer: Customer;
  messages: any[];
  startTime: Date;
  endTime?: Date;
  status: 'active' | 'ended' | 'transferred';
}

const ChatDashboard: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      status: 'online',
      lastMessage: 'I need help finding the perfect dress for my wedding!',
      lastMessageTime: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      unreadCount: 2,
      priority: 'high',
      tags: ['wedding', 'dress', 'urgent']
    },
    {
      id: '2',
      name: 'Mike Chen',
      email: 'mike.chen@email.com',
      status: 'online',
      lastMessage: 'What colors work best for a business casual look?',
      lastMessageTime: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      unreadCount: 0,
      priority: 'medium',
      tags: ['business', 'casual', 'colors']
    },
    {
      id: '3',
      name: 'Emma Davis',
      email: 'emma.davis@email.com',
      status: 'away',
      lastMessage: 'Thank you for the style advice!',
      lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      unreadCount: 0,
      priority: 'low',
      tags: ['style', 'advice']
    }
  ]);

  const [activeConversations, setActiveConversations] = useState<Conversation[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'online' | 'offline' | 'away'>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  // Filter customers based on search and filters
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.lastMessage.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || customer.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || customer.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const startConversation = (customer: Customer) => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      customerId: customer.id,
      customer,
      messages: [],
      startTime: new Date(),
      status: 'active'
    };

    setActiveConversations(prev => [...prev, newConversation]);
    setSelectedCustomer(customer);
  };

  const endConversation = (conversationId: string) => {
    setActiveConversations(prev => 
      prev.map(conv => 
        conv.id === conversationId 
          ? { ...conv, status: 'ended', endTime: new Date() }
          : conv
      )
    );
    setSelectedCustomer(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Customer List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Customer Conversations</h2>
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="text-sm border border-gray-300 rounded px-2 py-1"
            >
              <option value="all">All Status</option>
              <option value="online">Online</option>
              <option value="away">Away</option>
              <option value="offline">Offline</option>
            </select>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as any)}
              className="text-sm border border-gray-300 rounded px-2 py-1"
            >
              <option value="all">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {/* Customer List */}
        <ScrollArea className="flex-1">
          <div className="p-2">
            {filteredCustomers.map((customer) => (
              <div
                key={customer.id}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedCustomer?.id === customer.id 
                    ? 'bg-blue-50 border border-blue-200' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => startConversation(customer)}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={customer.avatar} alt={customer.name} />
                      <AvatarFallback className="bg-gray-200">
                        {customer.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(customer.status)}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-sm truncate">{customer.name}</h3>
                      <div className="flex items-center gap-1">
                        {customer.unreadCount > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {customer.unreadCount}
                          </Badge>
                        )}
                        <Badge className={`text-xs ${getPriorityColor(customer.priority)}`}>
                          {customer.priority}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-500 truncate mt-1">
                      {customer.lastMessage}
                    </p>
                    
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-400">
                        {formatTimeAgo(customer.lastMessageTime)}
                      </span>
                      <div className="flex gap-1">
                        {customer.tags.slice(0, 2).map((tag, index) => (
                          <span key={index} className="text-xs bg-gray-100 text-gray-600 px-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Quick Stats */}
        <div className="p-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-blue-600">
                {customers.filter(c => c.status === 'online').length}
              </div>
              <div className="text-xs text-gray-500">Online</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-orange-600">
                {customers.filter(c => c.unreadCount > 0).length}
              </div>
              <div className="text-xs text-gray-500">Unread</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedCustomer ? (
          <ChatInterface
            customerName={selectedCustomer.name}
            customerId={selectedCustomer.id}
            onMessageSent={(message) => {
              console.log('Message sent:', message);
              // Update customer's last message
              setCustomers(prev => 
                prev.map(c => 
                  c.id === selectedCustomer.id 
                    ? { ...c, lastMessage: message.text, lastMessageTime: new Date() }
                    : c
                )
              );
            }}
            onConversationEnd={() => {
              const activeConv = activeConversations.find(c => c.customerId === selectedCustomer.id);
              if (activeConv) {
                endConversation(activeConv.id);
              }
            }}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Select a customer to start chatting
              </h3>
              <p className="text-gray-500">
                Choose a customer from the list to begin a conversation
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatDashboard; 