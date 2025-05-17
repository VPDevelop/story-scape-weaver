
import { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LogOut, User } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
  session: any;
  loading: boolean;
}

const Layout = ({ children, session, loading }: LayoutProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out successfully",
      });
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error signing out",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="text-xl font-bold text-primary"
            >
              LunaTales
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <Navbar />
            
            {!loading && (
              session ? (
                <div className="flex items-center gap-2">
                  <Link to="/library">
                    <Button variant="outline" size="sm">
                      <User className="h-4 w-4 mr-2" />
                      My Stories
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Link to="/auth">
                  <Button size="sm">
                    Sign In
                  </Button>
                </Link>
              )
            )}
          </div>
        </div>
      </header>
      
      <main className="container flex-1 py-6">
        {children}
      </main>
      
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground">
            © 2025 LunaTales. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              Home
            </Link>
            <Link
              to="/library"
              className="text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              My Stories
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
