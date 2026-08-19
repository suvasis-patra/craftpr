import { requiredAuth } from "@/features/auth/actions";
import DashboardShell from "@/features/dashboard/components/dashboard-shell";
import React from "react";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await requiredAuth();
  return (
    <DashboardShell user={session.user} plan={"pro"}>
      {children}
    </DashboardShell>
  );
};

export default DashboardLayout;
