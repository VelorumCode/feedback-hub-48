import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Search, User, Mail, Clock, MessageSquare, Loader2 } from "lucide-react";

interface Feedback {
  id: string;
  name: string;
  email: string;
  feedback: string;
  created_at: string;
}

interface FeedbackSearchProps {
  refreshTrigger: number;
}

const FeedbackSearch = ({ refreshTrigger }: FeedbackSearchProps) => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState<Feedback[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAllFeedbacks();
  }, [refreshTrigger]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredFeedbacks(feedbacks);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = feedbacks.filter(
        (fb) =>
          fb.name.toLowerCase().includes(query) ||
          fb.email.toLowerCase().includes(query) ||
          fb.feedback.toLowerCase().includes(query)
      );
      setFilteredFeedbacks(filtered);
    }
  }, [searchQuery, feedbacks]);

  const fetchAllFeedbacks = async () => {
    try {
      const { data, error } = await supabase
        .from("feedback")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setFeedbacks(data || []);
      setFilteredFeedbacks(data || []);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search by name, email, or feedback..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-11 pl-10 rounded-lg border-input bg-background transition-all focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Results Count */}
      {!isLoading && (
        <p className="text-sm text-muted-foreground">
          {filteredFeedbacks.length} {filteredFeedbacks.length === 1 ? "result" : "results"} found
        </p>
      )}

      {/* Feedback List */}
      <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : filteredFeedbacks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <MessageSquare className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-medium">
              {searchQuery ? "No matching feedback found" : "No feedback available"}
            </p>
          </div>
        ) : (
          filteredFeedbacks.map((fb) => (
            <div
              key={fb.id}
              className="p-4 bg-secondary/50 rounded-xl border border-border/50 hover:border-border transition-colors"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-foreground truncate">{fb.name}</p>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Mail className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{fb.email}</span>
                  </div>
                </div>
              </div>

              <p className="text-foreground text-sm leading-relaxed mb-3 line-clamp-3">
                {fb.feedback}
              </p>

              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>{format(new Date(fb.created_at), "MMM d, yyyy 'at' h:mm a")}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FeedbackSearch;
