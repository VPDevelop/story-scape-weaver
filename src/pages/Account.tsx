
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import AccountHeader from "@/components/account/AccountHeader";
import AccountInfo from "@/components/account/AccountInfo";
import PasswordChangeForm from "@/components/account/PasswordChangeForm";
import SubscriptionInfo from "@/components/account/SubscriptionInfo";
import SignOutButton from "@/components/account/SignOutButton";

const Account = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse">Loading account information...</div>
      </div>
    );
  }

  return (
    <div className="py-8 px-2">
      <AccountHeader />
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>
            Your LunaTales account details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <AccountInfo userEmail={userEmail} />
          
          <Separator className="my-4" />
          
          <PasswordChangeForm userEmail={userEmail} />
          
          <Separator className="my-4" />
          
          <SubscriptionInfo />
        </CardContent>
      </Card>
      
      <div className="mt-8">
        <SignOutButton />
      </div>
    </div>
  );
};

export default Account;
