import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div></div>
      <div>{children}</div>
    </div>
  );
}
