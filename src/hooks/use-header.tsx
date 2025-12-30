'use client';

import { createContext, useContext, useState, useMemo, type ReactNode } from "react";

interface HeaderContextType {
    isMenuOpen: boolean;
    setMenuOpen: (isOpen: boolean) => void;
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export function HeaderProvider({ children }: { children: ReactNode }) {
    const [isMenuOpen, setMenuOpen] = useState(false);
    const value = useMemo(() => ({ isMenuOpen, setMenuOpen }), [isMenuOpen]);

    return (
        <HeaderContext.Provider value={value}>
            {children}
        </HeaderContext.Provider>
    );
}

export function useHeader() {
    const context = useContext(HeaderContext);
    if (!context) {
        throw new Error('useHeader must be used within a HeaderProvider');
    }
    return context;
}
