
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useStory } from "@/hooks/useStory";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import LoadingStory from "@/components/reader/LoadingStory";
import NotFoundStory from "@/components/reader/NotFoundStory";
import StoryHeader from "@/components/reader/StoryHeader";
import StoryContent from "@/components/reader/StoryContent";
import AudioPlayer from "@/components/reader/AudioPlayer";
import DeleteStoryDialog from "@/components/reader/DeleteStoryDialog";

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
    // We'll let the ImageWithLoader component handle the error toast
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
      {/* Action buttons container - positioned below header but above image */}
      <div className="sticky top-16 pt-4 pb-2 px-4 flex justify-between max-w-screen-lg mx-auto z-20 bg-background">
        {/* Back button with enhanced visibility */}
        <Button 
          variant="outline" 
          size="icon" 
          onClick={handleBack}
          className="rounded-full bg-background/90 backdrop-blur-sm shadow-md hover:bg-accent"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        {/* Delete button with enhanced visibility */}
        <DeleteStoryDialog storyId={story.id} storyTitle={story.title} />
      </div>
      
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
