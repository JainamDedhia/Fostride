// components/auth-context.tsx
import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "./supabase";

console.log("🔧 AuthContext: Module loaded");
console.log("🔧 Supabase URL:", supabase.supabaseUrl);

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 MOVE THE signOut FUNCTION OUTSIDE OF useEffect
  const signOut = async () => {
    try {
      console.log("🚪 Starting sign out process...");
      
      // First try normal sign out
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.warn("⚠️ Normal sign out failed, forcing cleanup...", error);
      }
      
      // Force clear all storage regardless of sign out result
      console.log("🧹 Clearing all auth storage...");
      
      // Clear all Supabase related storage
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('supabase') || key.includes('sb-') || key.includes('auth'))) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
        console.log("🗑️ Removed:", key);
      });
      
      // Clear session storage
      sessionStorage.clear();
      
      // Clear user state
      setUser(null);
      
      console.log("✅ Sign out completed, redirecting...");
      
      // Force redirect to login page
      window.location.href = '/';
      
    } catch (error) {
      console.error("❌ Sign out error:", error);
      // Even if error, force redirect
      localStorage.clear();
      sessionStorage.clear();
      setUser(null);
      window.location.href = '/';
    }
  };

  useEffect(() => {
    console.log("🔄 AuthProvider: useEffect triggered");
    console.log("🔄 Supabase instance:", supabase ? "✅ Loaded" : "❌ Missing");
    
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log("🔄 Checking initial session...");
        const { data, error } = await supabase.auth.getSession();
        
        console.log("📦 Session response - data:", data, "error:", error);
        
        if (error) {
          console.error("❌ Session error:", error);
          console.error("❌ Error details:", error.message, error.status);
        } else {
          console.log("✅ Session data received:", {
            hasSession: !!data.session,
            hasUser: !!data.session?.user,
            userEmail: data.session?.user?.email
          });
          if (mounted) {
            setUser(data.session?.user || null);
          }
        }
      } catch (err) {
        console.error("❌ Auth initialization error:", err);
        console.error("❌ Error stack:", err.stack);
      } finally {
        if (mounted) {
          console.log("✅ Auth initialization complete - setting loading to false");
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth state changes
    console.log("🔄 Setting up auth state listener...");
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("🔄 Auth state changed - Event:", event, "Session:", session ? "present" : "null");
        console.log("🔄 User email:", session?.user?.email);
        if (mounted) {
          setUser(session?.user || null);
          setLoading(false);
        }
      }
    );

    return () => {
      console.log("🔄 Cleaning up auth context");
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    loading,
    setUser,
    signOut // ✅ Now this will work!
  };

  console.log("🔄 AuthProvider rendering - user:", user?.email, "loading:", loading);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};