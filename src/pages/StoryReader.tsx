
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  const { story, loading } = useStory(id);
  const [refreshKey] = useState(Date.now());
  
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
    <div className="-mt-4 -mx-4 pb-16 overflow-hidden">
      {/* Action buttons container with no top padding and 24px bottom margin */}
      <div className="top-14 pb-0 px-4 flex justify-between max-w-screen-lg mx-auto z-20 bg-background mb-6">
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
        onImageLoad={() => {}}
        onImageError={() => {}}
        imageLoading={false}
        key={`story-header-${story.id}-${refreshKey}`}
      />
      
      <StoryContent text={story.text} />
      
      <AudioPlayer id={story.id} audioUrl={story.audio_url} />
    </div>
  );
};

export default StoryReader;
