
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const SignOutButton = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

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

  return (
    <Button variant="outline" onClick={handleSignOut} className="text-red-500 border-red-200">
      <LogOut className="h-4 w-4 mr-2" />
      Sign Out
    </Button>
  );
};

export default SignOutButton;
