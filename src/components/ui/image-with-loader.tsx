
import { useState, useEffect, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, ImageOff } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";

interface ImageWithLoaderProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  aspectRatio?: number;
  className?: string;
  imgClassName?: string;
  skeletonClassName?: string;
}

export function ImageWithLoader({
  src,
  alt,
  aspectRatio = 3/2,
  className,
  imgClassName,
  skeletonClassName,
  ...props
}: ImageWithLoaderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [imgSrc, setImgSrc] = useState(src);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const maxRetries = 3;
  const retryDelay = 1500;

  useEffect(() => {
    setImgSrc(src);
    setIsLoading(true);
    setHasError(false);
    setRetryCount(0);
    
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [src]);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    if (retryCount < maxRetries) {
      setRetryCount(prev => prev + 1);
      
      retryTimeoutRef.current = setTimeout(() => {
        // Add a cache-busting query param to force a fresh request
        setImgSrc(`${src}${src.includes('?') ? '&' : '?'}retry=${Date.now()}`);
      }, retryDelay);
    } else {
      setIsLoading(false);
      setHasError(true);
      toast({
        title: "Image failed to load",
        description: "The image could not be loaded after multiple attempts.",
        variant: "destructive",
      });
    }
  };

  const handleRetryClick = () => {
    setIsLoading(true);
    setHasError(false);
    setRetryCount(0);
    setImgSrc(`${src}${src.includes('?') ? '&' : '?'}retry=${Date.now()}`);
  };

  return (
    <div className={cn("relative overflow-hidden rounded-md", className)}>
      <AspectRatio ratio={aspectRatio} className="w-full">
        {isLoading && (
          <Skeleton 
            className={cn(
              "absolute inset-0 w-full h-full animate-pulse", 
              skeletonClassName
            )} 
          />
        )}
        
        {hasError ? (
          <div 
            onClick={handleRetryClick}
            className="absolute inset-0 flex flex-col items-center justify-center bg-muted cursor-pointer"
          >
            <ImageOff className="h-8 w-8 text-muted-foreground mb-2" />
            <span className="text-xs text-muted-foreground">Tap to retry</span>
          </div>
        ) : (
          <img
            src={imgSrc}
            alt={alt}
            onLoad={handleLoad}
            onError={handleError}
            loading="lazy"
            className={cn(
              "object-cover w-full h-full transition-opacity duration-200",
              isLoading ? "opacity-0" : "opacity-100",
              imgClassName
            )}
            {...props}
          />
        )}
        
        {isLoading && retryCount > 0 && (
          <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs rounded-full p-1">
            <RefreshCw className="h-3 w-3 animate-spin" />
          </div>
        )}
      </AspectRatio>
    </div>
  );
}
