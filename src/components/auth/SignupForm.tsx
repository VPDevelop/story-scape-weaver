
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

const signupSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

interface SignupFormProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const SignupForm = ({ isLoading, setIsLoading }: SignupFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [signupError, setSignupError] = useState<string | null>(null);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSignup = async (values: SignupFormValues) => {
    try {
      setIsLoading(true);
      setSignupError(null);
      
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
      });

      if (error) {
        // Check specifically for the user already exists error
        if (error.message?.includes("User already registered")) {
          setSignupError("This email is already registered. Please log in instead.");
          return;
        }
        throw error;
      }

      toast({
        title: "Sign up successful",
        description: "Please check your email to confirm your account",
      });
      
      // If email confirmation is disabled in Supabase, redirect to library
      if (data.session) {
        navigate("/library");
      }
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Sign up failed",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSignup)} className="space-y-4">
        {signupError && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{signupError}</AlertDescription>
          </Alert>
        )}
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
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="Create a password"
                  type="password"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="Confirm your password"
                  type="password"
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
          {isLoading ? "Creating account..." : "Sign Up"}
        </Button>
      </form>
    </Form>
  );
};

export default SignupForm;
