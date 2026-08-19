import { notRequiredAuth } from "@/features/auth/actions";
import React from "react";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await notRequiredAuth();
  return (
    <div>
      <div>{children}</div>
    </div>
  );
}
