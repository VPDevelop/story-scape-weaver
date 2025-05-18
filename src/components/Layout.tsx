
import { ReactNode, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import UserMenu from "@/components/UserMenu";

interface LayoutProps {
  children: ReactNode;
  session: any;
  loading: boolean;
}

const Layout = ({ children, session, loading }: LayoutProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user?.email) {
      setUserEmail(session.user.email);
    } else {
      setUserEmail(null);
    }
  }, [session]);

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
            
            {!loading && session ? (
              <UserMenu userEmail={userEmail} />
            ) : (
              !loading && (
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
          <div className="flex flex-wrap items-center justify-center gap-4">
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
              Library
            </Link>
            <Link
              to="/legal"
              className="text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              Legal
            </Link>
            <Link
              to="/legal/privacy"
              className="text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              Privacy
            </Link>
            <Link
              to="/legal/terms"
              className="text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              Terms
            </Link>
            <Link
              to="/legal/cookies"
              className="text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              Cookies
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
