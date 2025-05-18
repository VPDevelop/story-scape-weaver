
import { ImageWithLoader } from "@/components/ui/image-with-loader";

interface StoryHeaderProps {
  title: string;
  imageUrl: string | null;
  onImageLoad: () => void;
  onImageError: () => void;
  imageLoading: boolean;
}

const StoryHeader = ({ 
  title, 
  imageUrl, 
  onImageLoad, 
  onImageError, 
  imageLoading 
}: StoryHeaderProps) => {
  // Use a default image URL based on the story title if no imageUrl is provided
  const imageSource = imageUrl || `https://source.unsplash.com/random/1200x800/?${encodeURIComponent(title)}`;
  
  return (
    <>
      {/* Full-width image with reduced padding */}
      <div className="w-full h-[36vh] md:h-[45vh] relative">
        {!imageLoading && (
          <ImageWithLoader 
            src={imageSource}
            alt={title}
            aspectRatio={16/9}
            className="w-full h-full"
            imgClassName="w-full h-full object-cover"
            onLoad={onImageLoad}
            onError={onImageError}
          />
        )}
        
        {imageLoading && (
          <div className="w-full h-full flex items-center justify-center bg-muted/30">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-2"></div>
              <span className="text-sm text-muted-foreground">Generating image...</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Title with reduced padding */}
      <div className="px-6 pt-2 pb-1">
        <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
      </div>
    </>
  );
};

export default StoryHeader;
