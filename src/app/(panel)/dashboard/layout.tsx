"use client" // necessário para Client Components e Sonner

import { SidebarDashboard } from "./_components/sidebar";
import { Toaster } from "sonner"; // import do Toaster

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SidebarDashboard>
        {children}
      </SidebarDashboard>
      
      
      <Toaster />
    </>
  );
}
