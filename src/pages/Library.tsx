
import { useEffect, useState, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ImageWithLoader } from "@/components/ui/image-with-loader";

interface Story {
  id: string;
  title: string;
  lang: string;
  text: string | null;
  image_url: string | null;
  audio_url: string | null;
  created_at: string;
}

const Library = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(Date.now()); // Add a refresh key state
  const { toast } = useToast();
  const location = useLocation();
  
  // Update refresh key when navigation occurs
  useEffect(() => {
    setRefreshKey(Date.now());
  }, [location.key]);
  
  const fetchStories = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setStories(data || []);
    } catch (error) {
      console.error('Error fetching stories:', error);
      toast({
        title: "Error loading stories",
        description: "Please try again later or verify you're logged in.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);
  
  useEffect(() => {
    fetchStories();
    
    // Set up a subscription to listen for changes to stories
    const channel = supabase
      .channel('public:stories')
      .on('postgres_changes', {
        event: 'DELETE',
        schema: 'public',
        table: 'stories',
      }, (payload) => {
        console.log('Story deleted:', payload);
        setStories(prev => prev.filter(story => story.id !== payload.old.id));
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchStories, location.key]); // Re-fetch when navigation occurs
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (stories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-center">
        <div className="mb-6 p-6 bg-story-lightPurple/20 rounded-full">
          <BookOpen className="h-16 w-16 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Your library is empty</h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          Create your first personalized story by adding your child's details and choosing a theme.
        </p>
        <Button asChild>
          <Link to="/new">Create Your First Story</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="py-6">
      <h1 className="text-3xl font-bold mb-6 text-center md:text-left">Your Story Library</h1>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {stories.map((story) => (
          <Link to={`/story/${story.id}`} key={story.id}>
            <Card className="h-full overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 border-2 border-transparent hover:border-primary/20">
              <div className="aspect-[3/4] relative overflow-hidden">
                <ImageWithLoader
                  src={story.image_url || `https://source.unsplash.com/random/300x400/?${encodeURIComponent(story.title)}`}
                  alt={story.title}
                  aspectRatio={3/4}
                  className="w-full h-full"
                  imgClassName="w-full h-full object-cover"
                  key={`story-${story.id}-${refreshKey}`} // Use the refreshKey to force re-render
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                  <h3 className="text-white font-bold text-lg line-clamp-2">{story.title}</h3>
                </div>
              </div>
              <CardFooter className="p-2 bg-background flex justify-between items-center">
                <div className="text-xs text-muted-foreground">
                  {new Date(story.created_at).toLocaleDateString()}
                </div>
                <div className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                  {story.lang || "English"}
                </div>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Library;
