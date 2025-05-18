
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import AuthTabs from "@/components/auth/AuthTabs";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

const Auth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showForgotPassword, setShowForgotPassword] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("login");

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate("/library");
      }
    };
    checkSession();
  }, [navigate]);

  const toggleForgotPassword = () => {
    setShowForgotPassword(!showForgotPassword);
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4">
      <div className="w-full max-w-md">
        <Card className="border-2">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl">Welcome to LunaTales</CardTitle>
            <CardDescription>
              Sign in or create an account to manage your stories
            </CardDescription>
          </CardHeader>
          <CardContent>
            {showForgotPassword ? (
              <ForgotPasswordForm 
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                toggleForgotPassword={toggleForgotPassword}
              />
            ) : (
              <AuthTabs 
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                toggleForgotPassword={toggleForgotPassword}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-center text-muted-foreground">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
