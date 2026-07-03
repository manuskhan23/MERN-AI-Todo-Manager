import { SignUp } from "@clerk/clerk-react";

export default function Register() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="bg-card p-8 rounded-2xl shadow-xl border border-light w-full max-w-md">
        <h1 className="text-3xl font-extrabold text-primary mb-6 text-center">
          Create Account
        </h1>

        <SignUp
          routing="path"
          path="/register"
          signInUrl="/login"
          fallbackRedirectUrl="/dashboard"
        />
      </div>
    </div>
  );
}