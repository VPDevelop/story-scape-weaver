
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface Story {
  id: string;
  title: string;
  childName: string;
  theme: string;
  language: string;
  coverImage: string;
  text: string;
  audioUrl?: string;
}

const StoryReader = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    const savedStories = JSON.parse(localStorage.getItem("stories") || "[]");
    const foundStory = savedStories.find((s: Story) => s.id === id);
    
    if (foundStory) {
      setStory(foundStory);
    }
    
    setLoading(false);
  }, [id]);
  
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
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-pulse bg-muted h-4 w-24 rounded"></div>
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
  
  // Generate a very basic placeholder text for the story
  const storyText = story.text || `Once upon a time, ${story.childName} went on an amazing ${story.theme} adventure...

In a world full of wonder and magic, ${story.childName} discovered the true meaning of courage and friendship.

As the journey continued, challenges appeared, but ${story.childName} faced them with determination and a kind heart.

At the end of this wonderful ${story.theme} adventure, ${story.childName} returned home with new wisdom and memories to cherish forever.

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
      <div className="w-full h-[40vh] md:h-[50vh]">
        <img 
          src={story.coverImage} 
          alt={story.title} 
          className="w-full h-full object-cover"
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
          <Button 
            onClick={handlePlayPause} 
            variant="ghost" 
            size="sm" 
            disabled={!story.audioUrl}
            className="rounded-full"
          >
            {isPlaying ? 'Pause' : 'Play'} 
          </Button>
          <div className="text-sm text-muted-foreground">
            {!story.audioUrl ? 'No audio available' : (isPlaying ? 'Playing...' : 'Click to play')}
          </div>
          {story.audioUrl && (
            <audio 
              ref={audioRef} 
              src={story.audioUrl} 
              onEnded={() => setIsPlaying(false)}
              controls={false}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default StoryReader;
