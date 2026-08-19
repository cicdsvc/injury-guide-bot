import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthUser } from "@/hooks/useAuthUser";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut } from "lucide-react";

export function AccountBar() {
  const { user, loading } = useAuthUser();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleSignOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  if (loading) return <div className="h-9" />;

  return (
    <div className="flex items-center gap-3">
      {user ? (
        <>
          <span className="hidden text-sm text-navy-foreground/70 sm:inline">
            {user.email}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            className="gap-2 border-navy-foreground/30 bg-transparent text-navy-foreground hover:bg-navy-foreground/10 hover:text-navy-foreground"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </>
      ) : (
        <Button
          asChild
          size="sm"
          variant="outline"
          className="gap-2 border-navy-foreground/30 bg-transparent text-navy-foreground hover:bg-navy-foreground/10 hover:text-navy-foreground"
        >
          <Link to="/auth">
            <LogIn className="h-4 w-4" />
            Sign in
          </Link>
        </Button>
      )}
    </div>
  );
}
