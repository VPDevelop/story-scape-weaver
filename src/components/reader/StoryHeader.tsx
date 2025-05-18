
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
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/20">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <img 
          src={imageUrl || `https://source.unsplash.com/random/1200x800/?${encodeURIComponent(title)}`} 
          alt={title} 
          className="w-full h-full object-cover"
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
