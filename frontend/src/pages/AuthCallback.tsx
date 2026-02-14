import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { API } from "../lib/api";
import { clearAuthSession, setAuthSession, type AuthRole } from "../lib/session";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const session = data.session;

        if (!session?.user?.email) {
          clearAuthSession();
          navigate("/", { replace: true });
          return;
        }

        // Read role stored BEFORE OAuth redirect
        const storedRole = localStorage.getItem("hireproof_role") || localStorage.getItem("oauthRole");
        const role: AuthRole = storedRole === "candidate" ? "candidate" : "recruiter";

        // Clean up both keys
        localStorage.removeItem("hireproof_role");
        localStorage.removeItem("oauthRole");

        const oauthExchange = await fetch(`${API}/api/auth/oauth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: session.user.email,
            name: session.user.user_metadata?.full_name ?? session.user.user_metadata?.name ?? "OAuth User",
            role,
          }),
        });

        if (!oauthExchange.ok) {
          clearAuthSession();
          navigate("/", { replace: true });
          return;
        }

        const payload = await oauthExchange.json();
        setAuthSession({
          token: payload.token,
          role,           // use the role WE chose, not the backend's
          user: { ...payload.user, role },
        });

        // Role-based redirect
        if (role === "candidate") {
          navigate("/candidate/home", { replace: true });
        } else {
          navigate("/recruiter/dashboard", { replace: true });
        }
      } catch {
        clearAuthSession();
        navigate("/", { replace: true });
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen grid place-items-center bg-[#0a0a0f]">
      <div className="text-center space-y-4">
        <div className="w-10 h-10 border-3 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto" />
        <p className="text-white/60 text-sm">Completing sign in...</p>
      </div>
    </div>
  );
}
