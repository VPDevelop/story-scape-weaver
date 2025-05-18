
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
  return (
    <>
      {/* Full-width image */}
      <div className="w-full h-[40vh] md:h-[50vh] relative">
        <ImageWithLoader 
          src={imageUrl || `https://source.unsplash.com/random/1200x800/?${encodeURIComponent(title)}`}
          alt={title}
          aspectRatio={16/9}
          className="w-full h-full"
          imgClassName="w-full h-full object-cover"
          onLoad={onImageLoad}
          onError={onImageError}
        />
      </div>
      
      {/* Title */}
      <div className="px-6 pt-6 pb-2">
        <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
      </div>
    </>
  );
};

export default StoryHeader;
