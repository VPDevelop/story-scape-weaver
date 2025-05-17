
import { NavLink } from "react-router-dom";
import { BookOpen, Book } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Navbar = () => {
  const isMobile = useIsMobile();
  
  const navLinkClass = ({ isActive }: { isActive: boolean }) => 
    `flex flex-col items-center gap-1 p-2 rounded-md transition-all ${
      isActive 
        ? "text-primary font-semibold bg-accent/50" 
        : "text-foreground/70 hover:text-primary hover:bg-accent/30"
    }`;

  return (
    <nav className="fixed bottom-0 left-0 w-full z-10 bg-background border-t">
      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-around w-full">
          <NavLink to="/library" className={navLinkClass}>
            <BookOpen className="h-5 w-5" />
            <span className="text-xs">Library</span>
          </NavLink>
          <NavLink to="/new" className={navLinkClass}>
            <Book className="h-5 w-5" />
            <span className="text-xs">New Story</span>
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
