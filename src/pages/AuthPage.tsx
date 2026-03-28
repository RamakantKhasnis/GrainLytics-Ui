import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wheat, Lock, User, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const email = `${username.toLowerCase().trim()}@grainguard.app`;

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error("Invalid username or password");
    } else {
      toast.success("Welcome back!");
    }
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    const email = `${username.toLowerCase().trim()}@grainguard.app`;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: username }
      }
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Account created! Check your email to confirm.");
      setIsSignUp(false);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl overflow-hidden mx-auto mb-4">
            <img src="/logo.png" alt="GRAINLYTICS Logo" className="h-full w-full object-cover" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">GRAINLYTICS</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isSignUp ? "Create your account" : "Sign in to your monitoring dashboard"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="rounded-xl border border-border bg-card p-6 space-y-4">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground uppercase tracking-wider">Username</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-9 bg-secondary/50 border-border"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground uppercase tracking-wider">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9 bg-secondary/50 border-border"
                required
              />
            </div>
          </div>

          {isSignUp && (
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground uppercase tracking-wider">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-9 bg-secondary/50 border-border"
                  required
                />
              </div>
            </div>
          )}

          <Button type="submit" className="w-full gap-2" disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowRight className="h-4 w-4" />
            )}
            {isSignUp ? "Sign Up" : "Sign In"}
          </Button>

          <div className="text-center text-sm">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-primary hover:underline"
            >
              {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
            </button>
          </div>

          {!isSignUp && (
            <div className="text-center text-xs text-muted-foreground mt-2">
              <p>Enter username only (e.g., superadmin)</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
