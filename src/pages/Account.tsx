
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { LogOut } from "lucide-react";

const Account = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const getUserData = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!data.session) {
          navigate("/auth");
          return;
        }
        
        setUserEmail(data.session.user.email);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    getUserData();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out successfully",
        duration: 3000,
      });
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error signing out",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse">Loading account information...</div>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl py-8">
      <h1 className="text-3xl font-bold mb-6">My Account</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>
            Your LunaTales account details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
            <p className="text-lg">{userEmail}</p>
          </div>
          
          {/* Placeholder for future subscription information */}
          <div className="mt-6 border-t pt-6">
            <h3 className="text-lg font-medium mb-2">Subscription</h3>
            <p className="text-muted-foreground mb-4">You are currently on the free plan.</p>
            <Button disabled className="bg-primary/80">
              Upgrade to Premium
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-8">
        <Button variant="outline" onClick={handleSignOut} className="text-red-500 border-red-200">
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default Account;
