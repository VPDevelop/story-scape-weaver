
const LoadingStory = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-muted-foreground animate-pulse">Loading your story...</p>
    </div>
  );
};

export default LoadingStory;
