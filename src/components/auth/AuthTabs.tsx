
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

interface AuthTabsProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  toggleForgotPassword: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AuthTabs = ({
  isLoading,
  setIsLoading,
  toggleForgotPassword,
  activeTab,
  setActiveTab
}: AuthTabsProps) => {
  return (
    <Tabs 
      value={activeTab} 
      className="w-full"
      onValueChange={setActiveTab}
    >
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="signup">Sign Up</TabsTrigger>
      </TabsList>
      
      <TabsContent value="login">
        <LoginForm 
          isLoading={isLoading} 
          setIsLoading={setIsLoading}
          toggleForgotPassword={toggleForgotPassword} 
        />
      </TabsContent>
      
      <TabsContent value="signup">
        <SignupForm 
          isLoading={isLoading} 
          setIsLoading={setIsLoading} 
        />
      </TabsContent>
    </Tabs>
  );
};

export default AuthTabs;
