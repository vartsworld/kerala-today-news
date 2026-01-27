import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SEO from "@/components/SEO";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Admin credentials are stored in Lovable Cloud backend
// Email: keralatoday@vaw.tech

const Auth = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Listen but do not navigate directly here to avoid loops
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      // no-op; checks run below
    });

    // On load, if logged in, only redirect if user is admin
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const user = session?.user;
      if (!user) return;
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .limit(1);
      if (data && data.length > 0) {
        navigate("/admin", { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogin = async () => {
    setLoading(true);
    const { data: signInData, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setLoading(false);
      toast({ title: "Login failed", description: error.message });
      return;
    }
    const user = signInData.user;
    if (!user) {
      setLoading(false);
      return;
    }
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .limit(1);
    setLoading(false);
    if (roles && roles.length > 0) {
      toast({ title: "Welcome back" });
      navigate("/admin", { replace: true });
    } else {
      toast({ title: "Access denied", description: "Your account is not an admin." });
    }
  };

  const handleSignup = async () => {
    setLoading(true);
    const redirectUrl = `${window.location.origin}/admin`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: redirectUrl },
    });
    setLoading(false);
    if (error) {
      toast({ title: "Signup failed", description: error.message });
    } else {
      toast({ title: "Check your email", description: "Confirm your address to finish signup." });
    }
  };

  return (
    <main className="container mx-auto max-w-md py-10">
      <SEO
        title={`${mode === "login" ? "Login" : "Sign up"} – Kerala Today News Admin`}
        description="Admin login for Kerala Today News"
        canonical="/auth"
      />
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-bold">Admin Access</h1>
        <p className="text-muted-foreground">Sign in to manage editorials</p>
      </header>

      <div className="grid gap-4">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-label="Email"
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-label="Password"
        />
        {mode === "login" ? (
          <Button onClick={handleLogin} disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        ) : (
          <Button onClick={handleSignup} disabled={loading}>
            {loading ? "Creating account…" : "Create account"}
          </Button>
        )}
        <button
          type="button"
          className="text-sm underline justify-self-start"
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
        >
          {mode === "login" ? "Need an account? Sign up" : "Have an account? Log in"}
        </button>
      </div>
    </main>
  );
};

export default Auth;
