"use client" // necessário para Client Components e Sonner

import { SidebarDashboard } from "./_components/sidebar";
import { Toaster } from "sonner"; // import do Toaster
import { QueryClientContext } from '@/providers/queryclient'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <QueryClientContext>
        <SidebarDashboard>
          <Toaster
            duration={2500}
          />
          {children}
        </SidebarDashboard>
      </QueryClientContext>

    </>
  );
}
