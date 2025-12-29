import { AppSidebar } from '@/components/AppSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import React from 'react';

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <SidebarProvider defaultOpen={true}>
        <AppSidebar />

        <main className="flex-1 p-6 overflow-y-auto">
          <SidebarTrigger className="bg-red-500 text-white hover:text-white/50" />
          {children}
        </main>
      </SidebarProvider>
    </div>
  );
}

export default AppLayout;
