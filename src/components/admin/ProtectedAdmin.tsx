import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface Props { children: ReactNode }

const ProtectedAdmin = ({ children }: Props) => {
  const navigate = useNavigate();
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    const redirected = { current: false } as { current: boolean };

    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setAllowed(false);
        if (!redirected.current) {
          redirected.current = true;
          navigate("/auth", { replace: true });
        }
        return;
      }
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .limit(1);
      if (error) console.error(error);
      const ok = !!data && data.length > 0;
      setAllowed(ok);
      if (!ok && !redirected.current) {
        redirected.current = true;
        navigate("/auth", { replace: true });
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      // Avoid calling supabase methods directly inside callback
      setTimeout(() => { void check(); }, 0);
    });

    void check();
    return () => subscription.unsubscribe();
  }, [navigate]);

  if (allowed === null) {
    return (
      <div className="container mx-auto py-20 text-center">
        <p>Checking admin access…</p>
      </div>
    );
  }
  if (!allowed) return null;
  return <>{children}</>;
};

export default ProtectedAdmin;
