
import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { KeyRound } from "lucide-react";
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

const passwordSchema = z.object({
  currentPassword: z.string().min(6, "Current password is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Please confirm your new password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

interface PasswordChangeFormProps {
  userEmail: string | null;
}

const PasswordChangeForm = ({ userEmail }: PasswordChangeFormProps) => {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const { toast } = useToast();

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handlePasswordChange = async (values: PasswordFormValues) => {
    try {
      setIsChangingPassword(true);
      
      // First verify the current password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: userEmail!,
        password: values.currentPassword,
      });
      
      if (signInError) {
        toast({
          title: "Current password is incorrect",
          variant: "destructive",
          duration: 3000,
        });
        return;
      }
      
      // Then update the password
      const { error: updateError } = await supabase.auth.updateUser({
        password: values.newPassword,
      });
      
      if (updateError) {
        throw updateError;
      }
      
      toast({
        title: "Password updated successfully",
        duration: 3000,
      });
      
      // Reset the form
      passwordForm.reset();
      
    } catch (error) {
      console.error("Error updating password:", error);
      toast({
        title: "Error updating password",
        description: "Please try again later",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-4">Change Password</h3>
      <Form {...passwordForm}>
        <form onSubmit={passwordForm.handleSubmit(handlePasswordChange)} className="space-y-4">
          <FormField
            control={passwordForm.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your current password"
                    {...field}
                    disabled={isChangingPassword}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={passwordForm.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your new password"
                    {...field}
                    disabled={isChangingPassword}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={passwordForm.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Confirm your new password"
                    {...field}
                    disabled={isChangingPassword}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="mt-2"
            disabled={isChangingPassword}
          >
            <KeyRound className="mr-2 h-4 w-4" />
            {isChangingPassword ? 'Updating...' : 'Update Password'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default PasswordChangeForm;
