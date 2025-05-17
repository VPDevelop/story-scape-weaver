
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

interface Story {
  id: string;
  title: string;
  childName: string;
  theme: string;
  language: string;
  created: string;
  coverImage: string;
}

const Library = () => {
  const [stories, setStories] = useState<Story[]>([]);
  
  useEffect(() => {
    const savedStories = JSON.parse(localStorage.getItem("stories") || "[]");
    setStories(savedStories);
  }, []);
  
  if (stories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-center">
        <div className="mb-6 p-6 bg-story-lightPurple/20 rounded-full">
          <BookOpen className="h-16 w-16 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Your library is empty</h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          Create your first personalized story by adding your child's details and choosing a theme.
        </p>
        <Button asChild>
          <Link to="/new">Create Your First Story</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="py-6">
      <h1 className="text-3xl font-bold mb-6 text-center md:text-left">Your Story Library</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {stories.map((story) => (
          <Link to={`/story/${story.id}`} key={story.id}>
            <Card className="h-full overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 border-2 border-transparent hover:border-primary/20">
              <div className="aspect-[3/4] relative overflow-hidden">
                <img 
                  src={story.coverImage} 
                  alt={story.title} 
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                  <h3 className="text-white font-bold text-lg line-clamp-2">{story.title}</h3>
                </div>
              </div>
              <CardFooter className="p-2 bg-background flex justify-between items-center">
                <div className="text-xs text-muted-foreground">
                  {new Date(story.created).toLocaleDateString()}
                </div>
                <div className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                  {story.theme}
                </div>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Library;
