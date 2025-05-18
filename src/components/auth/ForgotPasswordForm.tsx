
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordFormProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  toggleForgotPassword: () => void;
}

const ForgotPasswordForm = ({ 
  isLoading, 
  setIsLoading, 
  toggleForgotPassword 
}: ForgotPasswordFormProps) => {
  const { toast } = useToast();
  const [resetEmailSent, setResetEmailSent] = useState<boolean>(false);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleForgotPassword = async (values: ForgotPasswordFormValues) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${window.location.origin}/auth?tab=reset`,
      });

      if (error) {
        throw error;
      }

      setResetEmailSent(true);
      toast({
        title: "Reset email sent",
        description: "Check your email for a password reset link",
      });
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Failed to send reset email",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button 
        variant="ghost" 
        onClick={toggleForgotPassword}
        className="mb-2 -ml-2 text-sm"
      >
        ← Back to login
      </Button>
      
      {resetEmailSent ? (
        <Alert>
          <AlertDescription>
            If an account exists with this email address, you will receive a password reset link shortly.
            Please check your email and follow the instructions to reset your password.
          </AlertDescription>
        </Alert>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleForgotPassword)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      type="email"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Sending reset link..." : "Send Reset Link"}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
};

export default ForgotPasswordForm;
