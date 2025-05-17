
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

const formSchema = z.object({
  childName: z.string().min(1, "Child's name is required"),
  theme: z.string().min(1, "Theme is required"),
  language: z.string().min(1, "Language is required"),
});

type FormValues = z.infer<typeof formSchema>;

const NewStory = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      childName: "",
      theme: "",
      language: "English",
    },
  });
  
  const onSubmit = (data: FormValues) => {
    // In a real app, we'd send this to an API
    const storyId = Date.now().toString();
    const story = {
      id: storyId,
      childName: data.childName,
      theme: data.theme,
      language: data.language,
      title: `${data.childName}'s ${data.theme} Adventure`,
      created: new Date().toISOString(),
      coverImage: `https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=500&q=80`,
      text: `Once upon a time, ${data.childName} went on an amazing ${data.theme} adventure...`,
      audioUrl: "",
    };
    
    // Save to local storage
    const savedStories = JSON.parse(localStorage.getItem("stories") || "[]");
    localStorage.setItem("stories", JSON.stringify([...savedStories, story]));
    
    toast({
      title: "Story Created!",
      description: `${story.title} has been added to your library.`,
    });
    
    navigate(`/story/${storyId}`);
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
  
  const languages = ["English", "Spanish", "French", "German", "Chinese", "Japanese"];
  
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
                    name="language"
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
                              <SelectItem key={language} value={language}>
                                {language}
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
              
              <Button type="submit" className="w-full mt-6">
                Create Story
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewStory;
