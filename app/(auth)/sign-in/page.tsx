import BrandPanel from "@/features/auth/components/brand-panel";
import SignInForm from "@/features/auth/components/signin-form";

export default function SignIn() {
  return (
    <main
      data-testid="signin-page"
      className="min-h-screen w-full bg-background lg:grid lg:grid-cols-[1.15fr_1fr]"
    >
      <BrandPanel />
      <SignInForm />
    </main>
  );
}
