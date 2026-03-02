import { ArrowLeft, FileText, Users, AlertTriangle, Scale, MessageSquare, Ban } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const TermsOfService = () => {
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
            <h1 className="text-3xl font-bold text-foreground mb-2">Terms of Service</h1>
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Acceptance of Terms</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              By accessing and using Whisper Wall, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use our platform.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Platform Description</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Whisper Wall is an anonymous confession platform that allows users to share thoughts, feelings, and experiences without creating an account. All confessions are public and visible to everyone who visits the site.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Community Guidelines</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-4">
              To maintain a safe and supportive environment, all users must follow these guidelines:
            </p>
            <div className="space-y-3 text-muted-foreground">
              <div className="flex gap-3">
                <span className="text-primary font-semibold">✓</span>
                <p><strong className="text-foreground">Be Respectful:</strong> Treat others with kindness. Disagreements are okay, but personal attacks are not.</p>
              </div>
              <div className="flex gap-3">
                <span className="text-primary font-semibold">✓</span>
                <p><strong className="text-foreground">Protect Privacy:</strong> Do not share personal information about yourself or others that could lead to identification.</p>
              </div>
              <div className="flex gap-3">
                <span className="text-primary font-semibold">✓</span>
                <p><strong className="text-foreground">Be Supportive:</strong> If someone shares a difficult experience, respond with empathy rather than judgment.</p>
              </div>
              <div className="flex gap-3">
                <span className="text-primary font-semibold">✓</span>
                <p><strong className="text-foreground">Use Appropriately:</strong> This platform is for genuine expression, not spam, advertising, or trolling.</p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Ban className="h-5 w-5 text-destructive" />
              <h2 className="text-xl font-semibold text-foreground">Prohibited Content</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-4">
              The following content is strictly prohibited and will be removed:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Hate speech, discrimination, or content targeting individuals or groups</li>
              <li>Threats of violence or encouragement of self-harm</li>
              <li>Illegal content or discussion of illegal activities</li>
              <li>Explicit sexual content or pornography</li>
              <li>Personal information (names, addresses, phone numbers, etc.)</li>
              <li>Spam, advertising, or promotional content</li>
              <li>Impersonation or false claims about real people</li>
              <li>Content that violates intellectual property rights</li>
            </ul>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Moderation & Enforcement</h2>
            </div>
            <div className="space-y-4 text-muted-foreground">
              <p className="leading-relaxed">
                <strong className="text-foreground">Reporting:</strong> Users can report confessions that violate these guidelines. Our moderation team reviews all reports and takes appropriate action.
              </p>
              <p className="leading-relaxed">
                <strong className="text-foreground">Content Removal:</strong> We reserve the right to remove any content that violates these terms without prior notice.
              </p>
              <p className="leading-relaxed">
                <strong className="text-foreground">Rate Limiting:</strong> To prevent spam, users are limited to 3 confessions per day. This is enforced using anonymous browser fingerprinting.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Disclaimer</h2>
            </div>
            <div className="space-y-4 text-muted-foreground">
              <p className="leading-relaxed">
                <strong className="text-foreground">No Warranty:</strong> Whisper Wall is provided "as is" without warranties of any kind. We do not guarantee the accuracy, completeness, or reliability of any content posted by users.
              </p>
              <p className="leading-relaxed">
                <strong className="text-foreground">User Responsibility:</strong> You are solely responsible for the content you post. By submitting a confession, you affirm that it does not violate these terms or any applicable laws.
              </p>
              <p className="leading-relaxed">
                <strong className="text-foreground">No Professional Advice:</strong> Content on this platform should not be considered professional advice. If you are experiencing a crisis, please contact appropriate professional services.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Changes to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update these Terms of Service at any time. Continued use of the platform after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section className="space-y-4 border-t border-border pt-6">
            <h2 className="text-xl font-semibold text-foreground">Contact</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have questions about these terms or need to report a violation, please use the report feature on individual confessions or reach out through our community channels.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
