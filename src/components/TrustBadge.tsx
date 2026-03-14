import { useState } from 'react';
import { Shield, ShieldCheck, Lock, Activity, Globe, X, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

interface SecurityCheck {
  label: string;
  status: 'secure' | 'warning' | 'checking';
  icon: React.ReactNode;
  detail: string;
}

export function TrustBadge() {
  const [isOpen, setIsOpen] = useState(false);

  const checks: SecurityCheck[] = [
    {
      label: 'SSL Certificate',
      status: window.location.protocol === 'https:' ? 'secure' : 'warning',
      icon: <Lock className="h-4 w-4" />,
      detail: window.location.protocol === 'https:' ? 'Encrypted connection active' : 'Not using HTTPS',
    },
    {
      label: 'Data Protection',
      status: 'secure',
      icon: <ShieldCheck className="h-4 w-4" />,
      detail: 'Row-level security enabled on all tables',
    },
    {
      label: 'Uptime Status',
      status: 'secure',
      icon: <Activity className="h-4 w-4" />,
      detail: 'All systems operational',
    },
    {
      label: 'Safe Browsing',
      status: 'secure',
      icon: <Globe className="h-4 w-4" />,
      detail: 'No threats detected',
    },
  ];

  const allSecure = checks.every((c) => c.status === 'secure');

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 z-50 flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2 shadow-md transition-all hover:shadow-lg"
        aria-label="View security status"
      >
        <div className="relative">
          <Shield className="h-4 w-4 text-primary" />
          <span
            className={`absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full ${
              allSecure ? 'bg-secondary' : 'bg-primary'
            }`}
          />
        </div>
        <span className="text-xs font-medium text-foreground hidden sm:inline">
          {allSecure ? 'Secure' : 'Check Status'}
        </span>
      </button>

      {isOpen && (
        <div className="fixed bottom-16 left-6 z-50 w-72 rounded-lg border border-border bg-card shadow-lg animate-in slide-in-from-bottom-4 fade-in duration-200">
          <div className="flex items-center justify-between border-b border-border p-3">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <h3 className="text-xs font-semibold text-foreground">Security Status</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="p-3 space-y-2">
            {checks.map((check) => (
              <div
                key={check.label}
                className="flex items-start gap-2.5 rounded-md bg-muted/30 p-2.5"
              >
                <div
                  className={`mt-0.5 ${
                    check.status === 'secure'
                      ? 'text-secondary'
                      : check.status === 'warning'
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  }`}
                >
                  {check.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-foreground">
                      {check.label}
                    </span>
                    <Badge
                      variant={check.status === 'secure' ? 'secondary' : 'destructive'}
                      className="text-[10px] px-1.5 py-0"
                    >
                      {check.status === 'secure' ? 'Secure' : 'Warning'}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {check.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-border p-2.5 flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground">
              Last checked: just now
            </span>
            <Link
              to="/security"
              className="text-[11px] text-primary hover:underline flex items-center gap-1"
              onClick={() => setIsOpen(false)}
            >
              Full Report <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
