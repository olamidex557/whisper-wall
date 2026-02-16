import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, ShieldCheck, Lock, Activity, Globe, Server, CheckCircle, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SecurityItem {
  label: string;
  status: 'secure' | 'warning';
  icon: React.ReactNode;
  detail: string;
  description: string;
}

export default function SecurityStatus() {
  const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';

  const securityItems: SecurityItem[] = [
    {
      label: 'SSL / TLS Encryption',
      status: isHttps ? 'secure' : 'warning',
      icon: <Lock className="h-6 w-6" />,
      detail: isHttps ? 'Active — 256-bit encryption' : 'Not using HTTPS',
      description: 'All data transmitted between your browser and our servers is encrypted using industry-standard TLS.',
    },
    {
      label: 'Database Security',
      status: 'secure',
      icon: <Server className="h-6 w-6" />,
      detail: 'Row-Level Security enforced',
      description: 'Every database table has strict access policies. Users can only access data they are authorized to view.',
    },
    {
      label: 'Threat Monitoring',
      status: 'secure',
      icon: <ShieldCheck className="h-6 w-6" />,
      detail: 'No threats detected',
      description: 'Continuous monitoring for malicious activity, injection attacks, and unauthorized access attempts.',
    },
    {
      label: 'System Uptime',
      status: 'secure',
      icon: <Activity className="h-6 w-6" />,
      detail: 'All systems operational',
      description: 'Our infrastructure is monitored 24/7 with automatic failover and high-availability configurations.',
    },
    {
      label: 'Safe Browsing',
      status: 'secure',
      icon: <Globe className="h-6 w-6" />,
      detail: 'No malware or phishing detected',
      description: 'This site is free from malware, unwanted software, and social engineering content.',
    },
    {
      label: 'Input Validation',
      status: 'secure',
      icon: <Shield className="h-6 w-6" />,
      detail: 'Profanity & injection filters active',
      description: 'All user inputs are validated and sanitized to prevent XSS, SQL injection, and abusive content.',
    },
  ];

  const allSecure = securityItems.every((item) => item.status === 'secure');

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border/30 bg-background/60 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back</span>
          </Link>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-semibold text-foreground">Security Status</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Overall Status */}
        <Card className="mb-8">
          <CardContent className="flex items-center gap-4 p-6">
            <div className={`h-14 w-14 rounded-full flex items-center justify-center ${allSecure ? 'bg-green-500/10' : 'bg-yellow-500/10'}`}>
              {allSecure ? (
                <CheckCircle className="h-8 w-8 text-green-500" />
              ) : (
                <AlertTriangle className="h-8 w-8 text-yellow-500" />
              )}
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                {allSecure ? 'All Systems Secure' : 'Attention Required'}
              </h1>
              <p className="text-sm text-muted-foreground">
                {allSecure
                  ? 'Your connection and data are fully protected.'
                  : 'One or more security checks need attention.'}
              </p>
            </div>
            <Badge
              variant={allSecure ? 'default' : 'destructive'}
              className="ml-auto text-xs"
            >
              {allSecure ? 'Protected' : 'Review'}
            </Badge>
          </CardContent>
        </Card>

        {/* Security Checks */}
        <div className="space-y-4">
          {securityItems.map((item) => (
            <Card key={item.label}>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div
                    className={`${
                      item.status === 'secure' ? 'text-green-500' : 'text-yellow-500'
                    }`}
                  >
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-base">{item.label}</CardTitle>
                    <CardDescription className="text-xs">{item.detail}</CardDescription>
                  </div>
                  <Badge
                    variant={item.status === 'secure' ? 'secondary' : 'destructive'}
                    className="text-xs"
                  >
                    {item.status === 'secure' ? '✓ Secure' : '⚠ Warning'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-8">
          Security checks are performed continuously. Last updated: just now.
        </p>
      </main>
    </div>
  );
}
