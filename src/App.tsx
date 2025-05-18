
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import Layout from "@/components/Layout";
import Index from "@/pages/Index";
import Library from "@/pages/Library";
import NewStory from "@/pages/NewStory";
import StoryReader from "@/pages/StoryReader";
import NotFound from "@/pages/NotFound";
import Auth from "@/pages/Auth";
import Account from "@/pages/Account";
import { supabase } from "@/integrations/supabase/client";

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <ThemeProvider defaultTheme="light" storageKey="lunatales-theme">
      <Router>
        <Layout session={session} loading={loading}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/library" element={<Library />} />
            <Route path="/new" element={<NewStory />} />
            <Route path="/story/:id" element={<StoryReader />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/account" element={<Account />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </Router>
      <Toaster />
    </ThemeProvider>
  );
}
