"use client";

import React, { createContext, useState, useContext, useMemo } from 'react';
import type { User } from '@/lib/types';

type RoleContextType = {
  role: User['role'];
  setRole: (role: User['role']) => void;
};

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<User['role']>('reader');

  const value = useMemo(() => ({ role, setRole }), [role]);

  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
