// components/Register.tsx
import { useState } from "react";
import { supabase } from "./supabase";
import { ArrowRight } from 'lucide-react';

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      console.log("🔄 Starting Google OAuth...");
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) {
        console.error("❌ Google OAuth error:", error);
        setError(error.message);
      } else {
        console.log("✅ Google OAuth started successfully");
      }
    } catch (err: any) {
      console.error("❌ Failed to sign in with Google:", err);
      setError("Failed to sign in with Google");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Basic validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (!name.trim()) {
      setError("Please enter your name");
      setLoading(false);
      return;
    }

    if (!phone.trim()) {
      setError("Please enter your phone number");
      setLoading(false);
      return;
    }

    try {
      console.log("🔄 Starting registration for:", email);
      
      // 1. Create the auth user WITH email verification
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
            phone: phone,
          },
          emailRedirectTo: `${window.location.origin}/email-verified`
        }
      });

      // ============ CRITICAL DEBUGGING SECTION ============
      console.log("📊 Registration Response:", {
        user: authData?.user,
        session: authData?.session,
        emailConfirmedAt: authData?.user?.email_confirmed_at,
        identities: authData?.user?.identities,
        error: authError
      });

      // CHECK 1: Is there an error?
      if (authError) {
        console.error("❌ Registration error:", authError);
        setError(authError.message);
        setLoading(false);
        return;
      }

      // CHECK 2: Does user have a session immediately? (SHOULD BE NULL)
      if (authData?.session) {
        console.warn("⚠️⚠️⚠️ PROBLEM DETECTED: User has a session immediately!");
        console.warn("This means user is auto-confirmed. Check Supabase settings:");
        console.warn("1. Auth → Providers → Email → 'Enable email auto-confirm' should be OFF");
        console.warn("2. Auth → Providers → Email → 'Confirm email' should be ON");
      } else {
        console.log("✅ Good: No session returned (user needs to verify email)");
      }

      // CHECK 3: Is email already confirmed? (SHOULD BE NULL)
      if (authData?.user?.email_confirmed_at) {
        console.warn("⚠️⚠️⚠️ PROBLEM: email_confirmed_at is already set!");
        console.warn("Email confirmed at:", authData.user.email_confirmed_at);
        console.warn("This means auto-confirm is ON in Supabase");
      } else {
        console.log("✅ Good: email_confirmed_at is null (not yet verified)");
      }

      // CHECK 4: Check user identities
      console.log("🔍 User identities:", authData?.user?.identities);

      if (authData.user) {
        console.log("✅ User created successfully:", authData.user.id);
        console.log("📧 User should receive verification email at:", email);
        
        setSuccess(true);
        
        // Log success but warn if something is wrong
        if (authData.session || authData.user.email_confirmed_at) {
          setError("⚠️ Account created BUT email might not require verification. Check console logs!");
        }
      }
    } catch (err: any) {
      console.error("❌ Unexpected error:", err);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background images - matching App.tsx */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1748609160056-7b95f30041f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmFseXRpY3MlMjBkYXNoYm9hcmQlMjBjaGFydHN8ZW58MXx8fHwxNzU3Mzk3MDkwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Analytics Dashboard"
          className="absolute top-0 left-0 w-full h-full object-cover opacity-50"
        />
        <img 
          src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwdmlzdWFsaXphdGlvbiUyMG1vbml0b3Jpbmd8ZW58MXx8fHwxNzU3NDY1NDk1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Data Visualization"
          className="absolute top-0 right-0 w-1/2 h-full object-cover opacity-50 mix-blend-overlay"
        />
      </div>
      
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/60 to-background/80"></div>
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent/30 rounded-full blur-3xl"></div>

      {/* Register Card */}
      <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8 relative z-10">
        {/* R3 Bin Header */}
        <div className="text-center mb-8 space-y-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-foreground tracking-tight font-[Alfa_Slab_One]">
              R3 Bin
            </h1>
            <div className="h-1 w-20 bg-primary mx-auto rounded-full"></div>
          </div>
          <p className="text-muted-foreground text-lg font-[Adamina]">
            Smart Waste Management System
          </p>
          <p className="text-muted-foreground/80 text-sm max-w-md mx-auto font-[Abhaya_Libre]">
            Real-time monitoring - Intelligent segregation
          </p>
        </div>
        
        {error && (
          <div className="bg-destructive/10 border border-destructive/30 text-destructive-foreground px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 border border-green-300 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm">
            ✅ Check your email for verification link! You must verify your email before logging in.
            <div className="mt-2 text-xs text-gray-600">
              📱 Check console (F12) for debugging info
            </div>
          </div>
        )}

        {/* Google Sign Up Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading || success}
          className="w-full bg-card border-2 border-border text-foreground py-3 rounded-xl hover:bg-accent/10 disabled:bg-muted transition-all duration-300 font-semibold text-lg shadow-sm hover:shadow-md disabled:shadow-none mb-6 flex items-center justify-center gap-3 group"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign up with Google
        </button>

        {/* Divider */}
        <div className="flex items-center mb-6">
          <div className="flex-1 border-t border-border"></div>
          <div className="px-3 text-muted-foreground text-sm">or</div>
          <div className="flex-1 border-t border-border"></div>
        </div>

        <form onSubmit={handleRegister}>
          {/* Name Field */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-foreground mb-2">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-background border-2 border-border rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-foreground placeholder:text-muted-foreground"
              required
              disabled={loading || success}
            />
          </div>

          {/* Email Field */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-foreground mb-2">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-background border-2 border-border rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-foreground placeholder:text-muted-foreground"
              required
              disabled={loading || success}
            />
          </div>

          {/* Phone Field */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-foreground mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 bg-background border-2 border-border rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-foreground placeholder:text-muted-foreground"
              required
              disabled={loading || success}
            />
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-foreground mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-background border-2 border-border rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-foreground placeholder:text-muted-foreground"
              required
              minLength={6}
              disabled={loading || success}
            />
          </div>

          {/* Confirm Password Field */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-foreground mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full px-4 py-3 bg-background border-2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-foreground placeholder:text-muted-foreground ${
                confirmPassword && password !== confirmPassword 
                  ? 'border-destructive focus:border-destructive focus:ring-destructive/20' 
                  : 'border-border focus:border-primary focus:ring-primary/20'
              }`}
              required
              minLength={6}
              disabled={loading || success}
            />
            {confirmPassword && password !== confirmPassword && (
              <p className="text-destructive text-sm mt-2 font-medium">⚠️ Passwords do not match</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="w-full bg-primary text-primary-foreground py-4 rounded-xl hover:bg-primary/90 disabled:bg-muted transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl disabled:shadow-none flex items-center justify-center gap-2 group"
          >
            {loading ? "Creating Account..." : success ? "Check Your Email! 📧" : "Create Account"}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </form>
        
        <p className="mt-6 text-base text-center text-muted-foreground">
          Already have an account?{" "}
          <span 
            onClick={goToLogin}
            className="text-primary hover:text-primary/80 hover:underline cursor-pointer font-bold transition-colors duration-200"
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
}