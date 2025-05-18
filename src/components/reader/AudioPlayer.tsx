
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Music, Loader2, Play, Pause } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface AudioPlayerProps {
  id: string;
  audioUrl: string | null;
}

const AudioPlayer = ({ id, audioUrl }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioGenerating, setAudioGenerating] = useState(false);
  const [audioDuration, setAudioDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Reset player state when audio URL changes
    if (audioUrl && audioRef.current) {
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, [audioUrl]);

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setAudioDuration(audioRef.current.duration);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
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
        duration: 3000, // Auto dismiss after 3 seconds
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
    <div className="fixed bottom-16 md:bottom-4 left-0 right-0 px-4 flex justify-center z-10">
      <div className="w-full max-w-3xl bg-card shadow-lg rounded-lg px-4 py-3 flex flex-col border border-border">
        {!audioUrl && !audioGenerating && (
          <Button 
            onClick={generateAudio} 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2 mx-auto"
          >
            <Music className="h-4 w-4" />
            Generate Audio Narration
          </Button>
        )}
        
        {audioGenerating && (
          <div className="flex items-center justify-center gap-3 py-2">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">Narration is being prepared...</span>
            <Skeleton className="h-2 flex-1 max-w-md" />
          </div>
        )}
        
        {audioUrl && (
          <div className="space-y-2 w-full">
            <div className="flex items-center gap-3">
              <Button 
                onClick={handlePlayPause} 
                variant="outline" 
                size="sm"
                className="h-9 w-9 rounded-full p-0 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-label={isPlaying ? "Pause narration" : "Play narration"}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              
              <div className="flex-1 space-y-1">
                <div className="bg-muted h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-primary h-2 rounded-full" 
                    style={{ width: `${(currentTime / audioDuration) * 100 || 0}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(audioDuration)}</span>
                </div>
              </div>
            </div>
            
            <audio 
              ref={audioRef} 
              src={audioUrl}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={() => setIsPlaying(false)}
              controls={false}
              aria-label="Story narration"
              className="hidden" // Hide the default player but keep it functional
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioPlayer;
