import React, { createContext, useContext, useState, useEffect } from 'react';

type UserRole = 'admin' | 'client' | 'manager';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  assignedClients?: string[]; // For managers to track which clients they manage
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const rolePermissions = {
  admin: ['*'], // Admin has all permissions
  client: [
    'view:own-mannequins',
    'view:own-analytics',
    'view:own-settings',
  ],
  manager: [
    'view:assigned-mannequins',
    'view:assigned-analytics',
    'edit:assigned-mannequins',
    'view:assigned-settings',
  ],
};

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Alice Admin',
    email: 'admin@demo.com',
    role: 'admin',
  },
  {
    id: '2',
    name: 'Manny Manager',
    email: 'manager@demo.com',
    role: 'manager',
    assignedClients: ['client1', 'client2'],
  },
  {
    id: '3',
    name: 'Clara Client',
    email: 'client@demo.com',
    role: 'client',
  },
];

const mockPassword = 'password';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    // Simulate async login
    await new Promise((resolve) => setTimeout(resolve, 300));
    const foundUser = mockUsers.find(u => u.email === email);
    if (!foundUser || password !== mockPassword) {
      throw new Error('Invalid credentials');
    }
    setUser(foundUser);
  };

  const logout = () => {
    setUser(null);
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    return rolePermissions[user.role]?.includes(permission) || false;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 