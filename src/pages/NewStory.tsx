
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  childName: z.string().min(1, "Child's name is required"),
  themes: z.array(z.string()).min(1, "At least one theme is required").max(2, "Maximum 2 themes allowed"),
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
      themes: [],
    },
  });
  
  const onSubmit = async (data: FormValues) => {
    console.log("Form submitted:", data);
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
      console.log("User ID:", userId);
      
      // Call the generateStory edge function with fixed English language
      const { data: storyData, error } = await supabase.functions.invoke('generateStory', {
        body: { 
          childName: data.childName, 
          theme: data.themes.join(", "), 
          lang: "en", // Fixed to English
          userId 
        }
      });
      
      if (error) {
        console.error("Error from edge function:", error);
        throw error;
      }
      
      console.log("Story created:", storyData);
      
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
    "Pirates",
    "Dragons",
    "Princesses",
    "Robots",
    "Magic School",
    "Time Travel",
    "Sports",
    "Music",
    "Jungle",
    "Arctic",
    "Desert",
    "Circus",
  ];
  
  const toggleTheme = (theme: string) => {
    const currentThemes = form.getValues().themes || [];
    
    if (currentThemes.includes(theme)) {
      // Remove theme if already selected
      form.setValue(
        "themes", 
        currentThemes.filter(t => t !== theme),
        { shouldValidate: true }
      );
    } else {
      // Add theme if not already selected and below limit
      if (currentThemes.length < 2) {
        form.setValue("themes", [...currentThemes, theme], { shouldValidate: true });
      } else {
        toast({
          title: "Maximum themes reached",
          description: "You can select up to 2 themes",
          variant: "default",
        });
      }
    }
  };
  
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
                
                <FormField
                  control={form.control}
                  name="themes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Story Themes (select up to 2)</FormLabel>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {themes.map((theme) => {
                          const isSelected = field.value?.includes(theme);
                          return (
                            <Badge 
                              key={theme} 
                              variant={isSelected ? "default" : "outline"}
                              className={`px-3 py-1 cursor-pointer text-sm hover:bg-primary/80 transition-colors ${isSelected ? 'bg-primary text-primary-foreground' : ''}`}
                              onClick={() => toggleTheme(theme)}
                            >
                              {theme}
                            </Badge>
                          );
                        })}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
