
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Music, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Story {
  id: string;
  title: string;
  lang: string;
  text: string | null;
  image_url: string | null;
  audio_url: string | null;
  created_at: string;
}

const StoryReader = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [audioGenerating, setAudioGenerating] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchStory = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('stories')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) {
          throw error;
        }
        
        setStory(data);
      } catch (error) {
        console.error('Error fetching story:', error);
        toast({
          title: "Error loading story",
          description: "The story could not be found or you don't have permission to view it.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchStory();

    // Set up a subscription to listen for changes to the story
    const channel = supabase
      .channel(`story_${id}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'stories',
        filter: `id=eq.${id}`,
      }, (payload) => {
        console.log('Story updated:', payload);
        setStory(payload.new as Story);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, toast]);
  
  const handlePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    
    setIsPlaying(!isPlaying);
  };
  
  const handleBack = () => {
    navigate('/library');
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    toast({
      title: "Image failed to load",
      description: "The story image could not be loaded.",
      variant: "destructive",
    });
  };

  const generateAudio = async () => {
    if (!id || !story) return;

    try {
      setAudioGenerating(true);
      
      const response = await fetch(`${supabase.supabaseUrl}/functions/v1/generateAudio`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabase.supabaseKey}`
        },
        body: JSON.stringify({
          storyId: id
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate audio');
      }

      const data = await response.json();
      
      toast({
        title: "Audio generated successfully",
        description: "Your story now has audio narration.",
      });

      // The story state will be updated via the realtime subscription
    } catch (error) {
      console.error('Error generating audio:', error);
      toast({
        title: "Error generating audio",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setAudioGenerating(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!story) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold mb-4">Story not found</h2>
        <Button onClick={handleBack}>Back to Library</Button>
      </div>
    );
  }
  
  // Generate a placeholder text if the story text is empty
  const storyText = story.text || `Once upon a time, in a world of wonder and magic, an incredible adventure began.

This is a placeholder for your story. The real content will appear when you add text to your stories.

As our hero faced challenges and made new friends, valuable lessons were learned about courage, kindness, and perseverance.

THE END`;
  
  return (
    <div className="-mt-4 -mx-4 pb-20 overflow-hidden">
      {/* Back button */}
      <Button 
        variant="outline" 
        size="icon" 
        onClick={handleBack}
        className="fixed top-4 left-4 z-10 md:top-20 rounded-full bg-background/80 backdrop-blur-sm"
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>
      
      {/* Full-width image */}
      <div className="w-full h-[40vh] md:h-[50vh] relative">
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/20">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <img 
          src={story.image_url || `https://source.unsplash.com/random/1200x800/?${encodeURIComponent(story.title)}`} 
          alt={story.title} 
          className="w-full h-full object-cover"
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      </div>
      
      {/* Title */}
      <div className="px-6 pt-6 pb-2">
        <h1 className="text-3xl md:text-4xl font-bold">{story.title}</h1>
      </div>
      
      {/* Story text in serif font */}
      <div className="px-6 py-6 max-w-3xl mx-auto">
        <div className="prose prose-lg prose-stone dark:prose-invert mx-auto font-serif">
          {storyText.split('\n\n').map((paragraph, index) => (
            <p key={index} className="mb-6 text-xl leading-relaxed">{paragraph}</p>
          ))}
        </div>
      </div>
      
      {/* Audio player */}
      <div className="fixed bottom-16 md:bottom-4 left-0 right-0 p-4 flex justify-center z-10">
        <div className="bg-card shadow-lg rounded-full px-4 py-2 flex items-center gap-3 border">
          {!story.audio_url && !audioGenerating && (
            <Button 
              onClick={generateAudio} 
              variant="ghost" 
              size="sm" 
              className="rounded-full flex items-center gap-1"
            >
              <Music className="h-4 w-4 mr-1" />
              Generate Audio
            </Button>
          )}
          
          {audioGenerating && (
            <div className="flex items-center gap-2 px-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Generating audio...</span>
            </div>
          )}
          
          {story.audio_url && (
            <>
              <Button 
                onClick={handlePlayPause} 
                variant="ghost" 
                size="sm" 
                disabled={!story.audio_url}
                className="rounded-full"
              >
                {isPlaying ? 'Pause' : 'Play'} 
              </Button>
              <div className="text-sm text-muted-foreground">
                {!story.audio_url ? 'No audio available' : (isPlaying ? 'Playing...' : 'Click to play')}
              </div>
              <audio 
                ref={audioRef} 
                src={story.audio_url} 
                onEnded={() => setIsPlaying(false)}
                controls={false}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoryReader;
