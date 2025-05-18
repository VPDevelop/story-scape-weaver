
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useStory } from "@/hooks/useStory";
import LoadingStory from "@/components/reader/LoadingStory";
import NotFoundStory from "@/components/reader/NotFoundStory";
import StoryHeader from "@/components/reader/StoryHeader";
import StoryContent from "@/components/reader/StoryContent";
import AudioPlayer from "@/components/reader/AudioPlayer";

const StoryReader = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [imageLoading, setImageLoading] = useState(true);
  const { toast } = useToast();
  const { story, loading } = useStory(id);
  
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
  
  const handleBack = () => {
    navigate('/library');
  };
  
  if (loading) {
    return <LoadingStory />;
  }
  
  if (!story) {
    return <NotFoundStory onBackClick={handleBack} />;
  }
  
  return (
    <div className="-mt-4 -mx-4 pb-20 overflow-hidden">
      <StoryHeader
        title={story.title}
        imageUrl={story.image_url}
        onImageLoad={handleImageLoad}
        onImageError={handleImageError}
        imageLoading={imageLoading}
      />
      
      <StoryContent text={story.text} />
      
      <AudioPlayer id={story.id} audioUrl={story.audio_url} />
    </div>
  );
};

export default StoryReader;
