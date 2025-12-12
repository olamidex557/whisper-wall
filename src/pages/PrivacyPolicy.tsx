import { ArrowLeft, Shield, Eye, Clock, Database, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const PrivacyPolicy = () => {
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
            <h1 className="text-3xl font-bold text-foreground mb-2">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Our Commitment to Privacy</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Confess is designed with privacy as a core principle. We believe everyone should be able to share their thoughts anonymously without fear of being tracked or identified. This policy explains how we handle data on our platform.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">What We Don't Collect</h2>
            </div>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Names, email addresses, or any personal identifiers</li>
              <li>IP addresses or precise location data</li>
              <li>Account information (we don't have accounts)</li>
              <li>Browsing history or activity outside our site</li>
              <li>Cookies for tracking or advertising purposes</li>
            </ul>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">What We Do Collect</h2>
            </div>
            <div className="space-y-4 text-muted-foreground">
              <p className="leading-relaxed">
                <strong className="text-foreground">Confession Content:</strong> The text you submit when posting a confession is stored in our database. This content is publicly visible and cannot be edited or deleted by you after submission.
              </p>
              <p className="leading-relaxed">
                <strong className="text-foreground">Browser Fingerprint:</strong> We generate an anonymous fingerprint based on general browser characteristics (such as screen size, timezone, and browser type). This is used solely for rate limiting to prevent spam. This fingerprint:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Cannot identify you personally</li>
                <li>Is not linked to any personal information</li>
                <li>Is only used to limit posts to 3 per day per device</li>
                <li>Changes if you clear your browser data or use a different device</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Data Retention</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Confessions remain on the platform indefinitely unless removed by our moderation team for violating community guidelines. Rate limiting data (fingerprints and post counts) is reset daily and not stored long-term.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Security</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              All data is transmitted over secure HTTPS connections. Our database is protected with industry-standard security measures. However, please remember that confessions are public—do not share information that could identify you or others.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Third-Party Services</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use cloud infrastructure services to host our application and database. These services may collect basic server logs (like request timestamps) for operational purposes, but this data is not used to identify individual users.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Changes to This Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this privacy policy from time to time. Any changes will be posted on this page with an updated revision date.
            </p>
          </section>

          <section className="space-y-4 border-t border-border pt-6">
            <h2 className="text-xl font-semibold text-foreground">Contact</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have questions about this privacy policy or our practices, please reach out through our community channels.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
