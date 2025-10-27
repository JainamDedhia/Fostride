// components/Login.tsx
import { useState, FormEvent } from "react";
import { supabase } from "./supabase";
import { ArrowRight } from 'lucide-react';

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        if (error.message.includes('Email not confirmed')) {
          setError('Please verify your email before logging in. Check your inbox for the verification link.');
        } else if (error.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please try again.');
        } else {
          setError(error.message);
        }
      }
    } catch (err: any) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) {
        setError(error.message);
      }
    } catch (err: any) {
      setError("Failed to sign in with Google");
    }
  };

  const goToRegister = () => {
    window.location.href = '/register';
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

      {/* Login Card */}
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
        
        {/* Google Sign In Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full bg-card border-2 border-border text-foreground py-3 rounded-xl hover:bg-accent/10 disabled:bg-muted transition-all duration-300 font-semibold text-lg shadow-sm hover:shadow-md disabled:shadow-none mb-6 flex items-center justify-center gap-3 group"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center mb-6">
          <div className="flex-1 border-t border-border"></div>
          <div className="px-3 text-muted-foreground text-sm">or</div>
          <div className="flex-1 border-t border-border"></div>
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-foreground mb-2">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-background border-2 border-border rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-foreground placeholder:text-muted-foreground"
              required
              disabled={loading}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-foreground mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-background border-2 border-border rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-foreground placeholder:text-muted-foreground"
              required
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-4 rounded-xl hover:bg-primary/90 disabled:bg-muted transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl disabled:shadow-none flex items-center justify-center gap-2 group"
          >
            {loading ? "Signing In..." : "Sign In with Email"}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </form>
        
        <p className="mt-6 text-base text-center text-muted-foreground">
          Don't have an account?{" "}
          <span 
            onClick={goToRegister}
            className="text-primary hover:text-primary/80 hover:underline cursor-pointer font-bold transition-colors duration-200"
          >
            Create Account
          </span>
        </p>
      </div>
    </div>
  );
}