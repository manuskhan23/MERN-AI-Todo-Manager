import { SignIn } from "@clerk/clerk-react";

export default function Login() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="bg-card p-8 rounded-2xl shadow-xl border border-light w-full max-w-md">
        <h1 className="text-3xl font-extrabold text-primary mb-6 text-center">
          Welcome Back
        </h1>

        <SignIn
          routing="path"
          path="/login"
          signUpUrl="/register"
          fallbackRedirectUrl="/dashboard"
        />
      </div>
    </div>
  );
}