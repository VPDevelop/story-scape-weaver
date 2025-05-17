
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

const AppBar = () => {
  return (
    <div className="fixed top-0 left-0 w-full z-10 bg-background border-b">
      <div className="container mx-auto px-4 h-14 flex justify-between items-center">
        <h1 className="text-xl font-bold text-primary">Storybook AI</h1>
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default AppBar;
