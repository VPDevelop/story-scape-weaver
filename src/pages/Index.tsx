
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export default function Index() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center space-y-4 text-center">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Personalized Children's Stories
        </h1>
        <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
          Create magical stories featuring your child as the hero.
          Customize themes, languages, and watch their imagination come alive.
        </p>
      </div>
      <div className="w-full max-w-sm space-y-2">
        {session ? (
          <div className="flex flex-col space-y-2">
            <Button asChild>
              <Link to="/new">
                Create a Story <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/library">
                <BookOpen className="mr-2 h-4 w-4" /> Visit Library
              </Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col space-y-2">
            <Button asChild>
              <Link to="/auth">
                Sign In <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <p className="text-xs text-muted-foreground">
              Create an account to get started with personalized stories
            </p>
          </div>
        )}
      </div>
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
        <div className="flex flex-col items-center space-y-2 border p-4 rounded-lg">
          <div className="p-2 bg-primary/10 rounded-full">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-xl font-bold">Personalized</h2>
          <p className="text-sm text-muted-foreground text-center">
            Each story features your child as the main character in a magical adventure.
          </p>
        </div>
        <div className="flex flex-col items-center space-y-2 border p-4 rounded-lg">
          <div className="p-2 bg-primary/10 rounded-full">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-xl font-bold">Educational</h2>
          <p className="text-sm text-muted-foreground text-center">
            Stories that engage and inspire while teaching valuable life lessons.
          </p>
        </div>
        <div className="flex flex-col items-center space-y-2 border p-4 rounded-lg">
          <div className="p-2 bg-primary/10 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <h2 className="text-xl font-bold">Memory Making</h2>
          <p className="text-sm text-muted-foreground text-center">
            Create stories that will become cherished memories for years to come.
          </p>
        </div>
      </div>
    </div>
  );
}
