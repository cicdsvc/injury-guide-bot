import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function HomeButton() {
  return (
    <Button asChild variant="ghost" size="sm" className="gap-2">
      <Link to="/">
        <Home className="h-4 w-4" />
        Main menu
      </Link>
    </Button>
  );
}
