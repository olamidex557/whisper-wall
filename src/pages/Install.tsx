import { useEffect, useState } from "react";
import { Download, Smartphone, Monitor, CheckCircle, Share, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/Header";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const Install = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);

    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto px-4 py-16 max-w-2xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-6">
            <Download className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Install Confess
          </h1>
          <p className="text-muted-foreground text-lg">
            Add Confess to your home screen for quick access — no app store needed.
          </p>
        </div>

        {isInstalled ? (
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="flex flex-col items-center gap-4 py-10">
              <CheckCircle className="w-16 h-16 text-primary" />
              <h2 className="text-xl font-semibold">Already Installed!</h2>
              <p className="text-muted-foreground text-center">
                Confess is installed on your device. Open it from your home screen.
              </p>
            </CardContent>
          </Card>
        ) : deferredPrompt ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-6 py-10">
              <Smartphone className="w-12 h-12 text-primary" />
              <h2 className="text-xl font-semibold">Ready to Install</h2>
              <p className="text-muted-foreground text-center">
                Install Confess for a faster, app-like experience.
              </p>
              <Button size="lg" onClick={handleInstall} className="gap-2">
                <Download className="w-5 h-5" />
                Install Now
              </Button>
            </CardContent>
          </Card>
        ) : isIOS ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-6 py-10">
              <Smartphone className="w-12 h-12 text-primary" />
              <h2 className="text-xl font-semibold">Install on iOS</h2>
              <div className="space-y-4 text-muted-foreground w-full max-w-sm">
                <div className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold shrink-0">1</span>
                  <p className="pt-1">Tap the <Share className="inline w-4 h-4 mx-1" /> <strong>Share</strong> button in Safari</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold shrink-0">2</span>
                  <p className="pt-1">Scroll down and tap <strong>"Add to Home Screen"</strong></p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold shrink-0">3</span>
                  <p className="pt-1">Tap <strong>"Add"</strong> to confirm</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center gap-6 py-10">
              <Monitor className="w-12 h-12 text-primary" />
              <h2 className="text-xl font-semibold">Install on Desktop</h2>
              <div className="space-y-4 text-muted-foreground w-full max-w-sm">
                <div className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold shrink-0">1</span>
                  <p className="pt-1">Click the <MoreVertical className="inline w-4 h-4 mx-1" /> menu in your browser's address bar</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold shrink-0">2</span>
                  <p className="pt-1">Select <strong>"Install Confess"</strong> or <strong>"Add to Home Screen"</strong></p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold shrink-0">3</span>
                  <p className="pt-1">Click <strong>"Install"</strong> to confirm</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          {[
            { icon: "⚡", title: "Instant Access", desc: "Open from your home screen" },
            { icon: "📴", title: "Works Offline", desc: "Browse even without internet" },
            { icon: "🔔", title: "Native Feel", desc: "Full-screen, app-like experience" },
          ].map((feature) => (
            <div key={feature.title} className="p-4 rounded-xl bg-muted/50">
              <div className="text-2xl mb-2">{feature.icon}</div>
              <h3 className="font-semibold text-sm">{feature.title}</h3>
              <p className="text-muted-foreground text-xs mt-1">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Install;
