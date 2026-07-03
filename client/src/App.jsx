import {
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  ClerkLoaded,
} from "@clerk/clerk-react";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import AIChatPage from "./pages/AIChatPage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <ClerkLoaded>
        <Routes>

          {/* Public routes */}

          <Route
            path="/"
            element={<>
              <SignedIn>
                <Navigate to="/dashboard" />
              </SignedIn>
              <SignedOut>
                <Navigate to="/login" />
              </SignedOut>
            </>}
          />

          <Route
            path="/login"
            element={
              <SignedOut>
                <Login />
              </SignedOut>
            }
          />

          <Route
            path="/register"
            element={
              <SignedOut>
                <Register />
              </SignedOut>
            }
          />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <>
                <SignedIn>
                  <Dashboard />
                </SignedIn>

                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />

          <Route
            path="/ai-chat"
            element={
              <>
                <SignedIn>
                  <AIChatPage />
                </SignedIn>

                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />

          <Route path="*" element={<Navigate to="/" />} />

        </Routes>
      </ClerkLoaded>
    </BrowserRouter>
  );
}