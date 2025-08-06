import React from 'react';
import { AppShell } from '@/components/app-shell';
import { AppHeader } from '@/components/app-header';
import { AppContent } from '@/components/app-content';

interface Props {
    children: React.ReactNode;
}

export default function AppLayout({ children }: Props) {
    return (
        <AppShell>
            <AppHeader />
            <AppContent>
                {children}
            </AppContent>
        </AppShell>
    );
}