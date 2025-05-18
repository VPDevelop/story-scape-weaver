
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface DeleteStoryDialogProps {
  storyId: string;
  storyTitle: string;
}

const DeleteStoryDialog = ({ storyId, storyTitle }: DeleteStoryDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from('stories')
        .delete()
        .eq('id', storyId);
      
      if (error) throw error;
      
      toast({
        title: "Story deleted",
        description: "The story has been removed from your library",
        duration: 3000,
      });
      
      navigate('/library');
    } catch (error) {
      console.error('Error deleting story:', error);
      toast({
        title: "Error deleting story",
        description: "Please try again later",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full bg-background/80 backdrop-blur-sm hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-surface border-border-neutral">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete story</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{storyTitle}"? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-border-neutral bg-surface text-text-primary hover:bg-divider">Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete} 
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteStoryDialog;
