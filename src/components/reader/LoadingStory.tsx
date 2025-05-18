
const LoadingStory = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <span className="ml-3 text-text-secondary">Loading your story...</span>
    </div>
  );
};

export default LoadingStory;
