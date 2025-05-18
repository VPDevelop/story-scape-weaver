
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Music, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AudioPlayerProps {
  id: string;
  audioUrl: string | null;
}

const AudioPlayer = ({ id, audioUrl }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioGenerating, setAudioGenerating] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    
    setIsPlaying(!isPlaying);
  };

  const generateAudio = async () => {
    if (!id) return;

    try {
      setAudioGenerating(true);
      
      const response = await fetch("https://drfufywfplvjrpmqfqlz.supabase.co/functions/v1/generateAudio", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyZnVmeXdmcGx2anJwbXFmcWx6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0OTUzNzEsImV4cCI6MjA2MzA3MTM3MX0.A7gtD1rP2Aj2EpLn7hxRaFa-JZaKCVLkEIjAszTKrJw`
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

  return (
    <div className="fixed bottom-16 md:bottom-4 left-0 right-0 p-4 flex justify-center z-10">
      <div className="bg-card shadow-lg rounded-full px-4 py-2 flex items-center gap-3 border">
        {!audioUrl && !audioGenerating && (
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
        
        {audioUrl && (
          <>
            <Button 
              onClick={handlePlayPause} 
              variant="ghost" 
              size="sm" 
              disabled={!audioUrl}
              className="rounded-full"
            >
              {isPlaying ? 'Pause' : 'Play'} 
            </Button>
            <div className="text-sm text-muted-foreground">
              {!audioUrl ? 'No audio available' : (isPlaying ? 'Playing...' : 'Click to play')}
            </div>
            <audio 
              ref={audioRef} 
              src={audioUrl} 
              onEnded={() => setIsPlaying(false)}
              controls={false}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default AudioPlayer;
