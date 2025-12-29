import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import React from 'react';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <SidebarProvider defaultOpen={true}>
        <AppSidebar />

        <main className="flex-1 p-6 overflow-y-auto">
          <SidebarTrigger />
          {children}
        </main>
      </SidebarProvider>
    </div>
  );
}

export default Layout;
