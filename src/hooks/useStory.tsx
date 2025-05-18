
import { useState, useEffect } from "react";
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

export const useStory = (id: string | undefined) => {
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
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
      .on('postgres_changes', {
        event: 'DELETE',
        schema: 'public',
        table: 'stories',
        filter: `id=eq.${id}`,
      }, (payload) => {
        console.log('Story deleted:', payload);
        setStory(null);
      })
      .subscribe((status) => {
        console.log(`Story subscription status for ${id}:`, status);
      });

    return () => {
      console.log(`Removing channel for story ${id}`);
      supabase.removeChannel(channel);
    };
  }, [id, toast]);

  return { story, loading };
};
