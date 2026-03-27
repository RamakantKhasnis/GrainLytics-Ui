import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wheat, Lock, User, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function AuthPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Map username to email internally
    const email = `${username.toLowerCase().trim()}@grainlytics.app`;

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error("Invalid username or password");
    } else {
      toast.success("Welcome back!");
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
            Sign in to your monitoring dashboard
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="rounded-xl border border-border bg-card p-6 space-y-4">
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

          <Button type="submit" className="w-full gap-2" disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowRight className="h-4 w-4" />
            )}
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}
