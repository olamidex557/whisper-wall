import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Animated background gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>

      <div className="relative z-10 text-center px-4 animate-fade-in">
        {/* Large 404 with gradient */}
        <div className="mb-6">
          <h1 className="text-[120px] sm:text-[180px] font-black leading-none bg-gradient-to-br from-primary via-accent to-secondary bg-clip-text text-transparent drop-shadow-2xl">
            404
          </h1>
        </div>

        {/* Emoji and message */}
        <div className="mb-8 space-y-4">
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto border border-primary/30">
            <span className="text-4xl">🤫</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            This secret doesn't exist
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            The page you're looking for has vanished into the void. Maybe it was never meant to be found.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            asChild
            size="lg"
            className="gap-2 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold px-8 glow-primary"
          >
            <Link to="/">
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => window.history.back()}
            className="gap-2 border-border/50 bg-card/50 hover:bg-primary/10 hover:border-primary/50 hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
        </div>

        {/* Decorative elements */}
        <div className="mt-16 flex justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0s' }} />
          <span className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0.2s' }} />
          <span className="w-2 h-2 rounded-full bg-secondary animate-bounce" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>
    </div>
  );
};

export default NotFound;
