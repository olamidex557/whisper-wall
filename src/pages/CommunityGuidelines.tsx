import { ArrowLeft, Heart, Shield, Users, MessageSquare, AlertTriangle, ThumbsUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CommunityGuidelines = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-3xl mx-auto px-4 py-8">
        <Link to="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Community Guidelines</h1>
            <p className="text-muted-foreground">A safe space starts with all of us.</p>
          </div>

          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Be Kind & Supportive</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              People come here to share vulnerable moments. Respond with empathy, not judgment. A kind word can make someone's day—your support matters more than you think.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Protect Privacy</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Never share personal information—yours or anyone else's. This includes names, locations, workplaces, phone numbers, or any details that could identify a person. Anonymity is what makes this space safe.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Respect Everyone</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Hate speech, discrimination, bullying, and personal attacks have no place here. Disagree respectfully. Remember there's a real person behind every confession.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Keep It Genuine</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              This platform is for honest expression—not spam, advertising, trolling, or fictional stories meant to provoke. Share what's real and meaningful to you.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <h2 className="text-xl font-semibold text-foreground">Zero Tolerance</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-4">
              The following will result in immediate content removal:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Threats of violence or encouragement of self-harm</li>
              <li>Explicit sexual content or pornography</li>
              <li>Illegal content or promotion of illegal activities</li>
              <li>Targeted harassment or doxxing</li>
              <li>Content exploiting or endangering minors</li>
            </ul>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <ThumbsUp className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Help Us Moderate</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              If you see something that violates these guidelines, use the report button on any confession. Our moderation team reviews every report. Together, we keep this community safe.
            </p>
          </section>

          <section className="space-y-4 border-t border-border pt-6">
            <p className="text-muted-foreground leading-relaxed text-sm">
              By using Whisper Wall, you agree to follow these guidelines. Repeated violations may result in rate-limiting or other restrictions. For full details, see our{" "}
              <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CommunityGuidelines;
