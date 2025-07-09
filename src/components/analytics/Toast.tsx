import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type = 'info', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getToastStyles = () => {
    const baseStyles = "fixed top-6 right-6 z-50 flex items-center justify-between p-4 rounded-lg shadow-lg border min-w-[280px] max-w-[400px] animate-in slide-in-from-top-2";
    
    switch (type) {
      case 'success':
        return cn(baseStyles, "bg-green-50 border-green-200 text-green-800");
      case 'error':
        return cn(baseStyles, "bg-red-50 border-red-200 text-red-800");
      case 'info':
      default:
        return cn(baseStyles, "bg-blue-50 border-blue-200 text-blue-800");
    }
  };

  return (
    <div className={getToastStyles()} role="status" aria-live="polite">
      <span className="text-sm font-medium">{message}</span>
      <button 
        className="ml-4 p-1 rounded-full hover:bg-black/10 transition-colors" 
        onClick={onClose} 
        aria-label="Close notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default Toast; 