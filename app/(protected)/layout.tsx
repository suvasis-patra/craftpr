import { requiredAuth } from "@/features/auth/actions";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requiredAuth();
  return <div>{children}</div>;
}
