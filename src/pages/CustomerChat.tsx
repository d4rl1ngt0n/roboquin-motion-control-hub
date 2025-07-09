import React from 'react';
import ChatInterface from '@/components/chat/ChatInterface';

const CustomerChat: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <ChatInterface customerName="Guest" />
    </div>
  );
};

export default CustomerChat; 