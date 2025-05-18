
import { Button } from "@/components/ui/button";

interface NotFoundStoryProps {
  onBackClick: () => void;
}

const NotFoundStory = ({ onBackClick }: NotFoundStoryProps) => {
  return (
    <div className="text-center py-16">
      <h2 className="text-2xl font-bold mb-4">Story not found</h2>
      <Button onClick={onBackClick}>Back to Library</Button>
    </div>
  );
};

export default NotFoundStory;
