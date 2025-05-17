
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
console.log("Supabase client (module scope):", supabase);

const formSchema = z.object({
  childName: z.string().min(1, "Child's name is required"),
  theme: z.string().min(1, "Theme is required"),
  lang: z.string().min(1, "Language is required"),
});

type FormValues = z.infer<typeof formSchema>;

const NewStory = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      childName: "",
      theme: "",
      lang: "en",
    },
  });
  
  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      
      // Check if user is authenticated
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to create a story.",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }
      
      // Get user ID
      const userId = sessionData.session.user.id;
      
      // Call the generateStory edge function
      const { data: storyData, error } = await supabase.functions.invoke('generateStory', {
        body: { 
          childName: data.childName, 
          theme: data.theme, 
          lang: data.lang, 
          userId 
        }
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Story Created!",
        description: `A personalized story has been created for ${data.childName}.`,
      });
      
      // Navigate to the story page
      navigate(`/story/${storyData.id}`);
    } catch (error) {
      console.error('Error creating story:', error);
      toast({
        title: "Error creating story",
        description: "Please try again or check if you're logged in.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const themes = [
    "Space",
    "Ocean",
    "Forest",
    "Dinosaurs",
    "Fairy Tale",
    "Adventure",
    "Animals",
    "Superheroes",
  ];
  
  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "zh", name: "Chinese" },
    { code: "ja", name: "Japanese" },
  ];
  
  return (
    <div className="max-w-4xl mx-auto py-8">
      <Card className="shadow-md border-2 border-story-purple/20">
        <CardHeader className="bg-story-purple/10 rounded-t-lg">
          <CardTitle className="text-2xl text-center text-primary">Create a New Story</CardTitle>
          <CardDescription className="text-center">
            Customize a special story for your child
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="childName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Child's Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter child's name" {...field} className="rounded-lg" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="theme"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Story Theme</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="rounded-lg">
                              <SelectValue placeholder="Select a theme" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {themes.map((theme) => (
                              <SelectItem key={theme} value={theme}>
                                {theme}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="lang"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Language</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="rounded-lg">
                              <SelectValue placeholder="Select a language" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {languages.map((language) => (
                              <SelectItem key={language.code} value={language.code}>
                                {language.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <Button type="submit" className="w-full mt-6" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Generate Story'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewStory;
