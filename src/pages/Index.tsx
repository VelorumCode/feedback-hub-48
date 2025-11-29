import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import FeedbackForm from "@/components/FeedbackForm";
import LatestFeedback from "@/components/LatestFeedback";
import FeedbackSearch from "@/components/FeedbackSearch";
import { MessageCircle, Sparkles, Search } from "lucide-react";

interface Feedback {
  id: string;
  name: string;
  email: string;
  feedback: string;
  created_at: string;
}

const Index = () => {
  const [latestFeedback, setLatestFeedback] = useState<Feedback | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchLatestFeedback = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("feedback")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      setLatestFeedback(data);
    } catch (error) {
      console.error("Error fetching feedback:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLatestFeedback();
  }, [fetchLatestFeedback]);

  const handleSubmitSuccess = () => {
    fetchLatestFeedback();
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <main className="min-h-screen bg-background py-8 px-4 sm:py-12 sm:px-6 lg:py-16">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8 sm:mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4">
            <MessageCircle className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Feedback Collector
          </h1>
          <p className="text-muted-foreground">
            We'd love to hear your thoughts and suggestions
          </p>
        </header>

        {/* Feedback Form Card */}
        <section
          className="bg-card rounded-2xl shadow-card border border-border p-6 sm:p-8 mb-6 animate-slide-up"
          aria-labelledby="form-heading"
        >
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 id="form-heading" className="font-semibold text-foreground">
              Submit Feedback
            </h2>
          </div>
          <FeedbackForm onSuccess={handleSubmitSuccess} />
        </section>

        {/* Latest Feedback Card */}
        <section
          className="bg-card rounded-2xl shadow-card border border-border p-6 sm:p-8 mb-6 animate-slide-up"
          style={{ animationDelay: "0.1s" }}
          aria-labelledby="latest-heading"
        >
          <h2 id="latest-heading" className="font-semibold text-foreground mb-5">
            Latest Feedback
          </h2>
          <LatestFeedback feedback={latestFeedback} isLoading={isLoading} />
        </section>

        {/* Search All Feedbacks Card */}
        <section
          className="bg-card rounded-2xl shadow-card border border-border p-6 sm:p-8 animate-slide-up"
          style={{ animationDelay: "0.2s" }}
          aria-labelledby="search-heading"
        >
          <div className="flex items-center gap-2 mb-5">
            <Search className="w-5 h-5 text-primary" />
            <h2 id="search-heading" className="font-semibold text-foreground">
              Search All Feedback
            </h2>
          </div>
          <FeedbackSearch refreshTrigger={refreshTrigger} />
        </section>

        {/* Footer */}
        <footer className="text-center mt-8 text-sm text-muted-foreground">
          <p>Your feedback helps us improve</p>
        </footer>
      </div>
    </main>
  );
};

export default Index;
