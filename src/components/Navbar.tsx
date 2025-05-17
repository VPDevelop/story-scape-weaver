
import { NavLink } from "react-router-dom";
import { Book, BookOpen, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const Navbar = () => {
  const isMobile = useIsMobile();
  
  const navLinkClass = ({ isActive }: { isActive: boolean }) => 
    `flex items-center gap-2 p-2 rounded-md transition-all ${
      isActive 
        ? "text-primary font-semibold bg-accent/50" 
        : "text-foreground/70 hover:text-primary hover:bg-accent/30"
    }`;

  return (
    <nav className="fixed bottom-0 left-0 w-full z-10 bg-background border-t md:top-0 md:border-t-0 md:border-b">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <div className="hidden md:block">
          <h1 className="text-xl font-bold text-primary">StoryPal</h1>
        </div>
        
        <div className="flex justify-around w-full md:w-auto md:gap-2">
          <NavLink to="/library" className={navLinkClass}>
            {isMobile ? (
              <BookOpen className="h-5 w-5" />
            ) : (
              <>
                <BookOpen className="h-5 w-5" />
                <span>Library</span>
              </>
            )}
          </NavLink>
          <NavLink to="/new" className={navLinkClass}>
            {isMobile ? (
              <Book className="h-5 w-5" />
            ) : (
              <>
                <Book className="h-5 w-5" />
                <span>New Story</span>
              </>
            )}
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
