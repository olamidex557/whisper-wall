import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Shield, Trash2, LogOut, ArrowLeft, Flag, AlertTriangle, CheckCircle, Loader2, UserPlus, Users, X, Sparkles, Activity, TrendingUp, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useInactivityTimeout } from '@/hooks/useInactivityTimeout';
import { Confession, Report, TAG_LABELS } from '@/types/confession';
import ConfessionTrendsChart from '@/components/ConfessionTrendsChart';
import { User } from '@supabase/supabase-js';

interface ReportWithConfession extends Report {
  confessions: Confession | null;
}

interface AdminUser {
  id: string;
  user_id: string;
  email: string;
}

// --- Sub-components ---

function StatCard({ icon: Icon, label, value, iconClassName, gradient }: {
  icon: React.ElementType; label: string; value: number; iconClassName?: string; gradient?: string;
}) {
  return (
    <Card className="relative overflow-hidden group hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 border-border/40">
      <div className={`absolute inset-0 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity ${gradient || 'bg-gradient-to-br from-primary to-secondary'}`} />
      <div className="absolute top-0 right-0 w-32 h-32 -translate-y-8 translate-x-8">
        <div className={`w-full h-full rounded-full opacity-[0.04] group-hover:opacity-[0.08] transition-opacity ${gradient || 'bg-primary'}`} />
      </div>
      <CardHeader className="pb-2 relative">
        <CardDescription className="text-[10px] uppercase tracking-[0.15em] font-semibold text-muted-foreground/80">{label}</CardDescription>
      </CardHeader>
      <CardContent className="relative pt-0">
        <div className="flex items-end justify-between">
          <span className="text-4xl font-black tracking-tight">{value}</span>
          <div className={`h-11 w-11 rounded-2xl flex items-center justify-center ${iconClassName?.includes('destructive') ? 'bg-destructive/10' : iconClassName?.includes('accent') ? 'bg-accent/10' : 'bg-primary/10'}`}>
            <Icon className={`h-5 w-5 ${iconClassName || 'text-primary'}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ReportsTable({ reports, deleteReport, deleteConfession }: {
  reports: ReportWithConfession[];
  deleteReport: ReturnType<typeof useMutation>;
  deleteConfession: ReturnType<typeof useMutation>;
}) {
  if (reports.length === 0) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        <div className="relative inline-block mb-6">
          <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mx-auto">
            <CheckCircle className="h-10 w-10 text-primary" />
          </div>
          <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary/20 animate-pulse" />
        </div>
        <p className="text-xl font-bold text-foreground">All clear!</p>
        <p className="text-sm mt-2 text-muted-foreground/80">No pending reports to review. The community is thriving.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-border/30 hover:bg-transparent">
            <TableHead className="text-[10px] uppercase tracking-[0.15em] font-bold text-muted-foreground/70">Confession</TableHead>
            <TableHead className="text-[10px] uppercase tracking-[0.15em] font-bold text-muted-foreground/70">Tag</TableHead>
            <TableHead className="text-[10px] uppercase tracking-[0.15em] font-bold text-muted-foreground/70">Reason</TableHead>
            <TableHead className="text-[10px] uppercase tracking-[0.15em] font-bold text-muted-foreground/70">Date</TableHead>
            <TableHead className="text-[10px] uppercase tracking-[0.15em] font-bold text-muted-foreground/70 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((report, index) => (
            <TableRow key={report.id} className="border-border/20 hover:bg-muted/20 transition-colors group" style={{ animationDelay: `${index * 50}ms` }}>
              <TableCell className="max-w-xs">
                <p className="truncate font-medium text-sm">{report.confessions?.content || 'Deleted'}</p>
              </TableCell>
              <TableCell>
                {report.confessions && (
                  <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary text-[10px] font-semibold">
                    {TAG_LABELS[report.confessions.tag as keyof typeof TAG_LABELS]}
                  </Badge>
                )}
              </TableCell>
              <TableCell className="max-w-xs">
                <p className="truncate text-muted-foreground text-sm">{report.reason}</p>
              </TableCell>
              <TableCell className="text-muted-foreground text-xs whitespace-nowrap">
                {format(new Date(report.created_at), 'MMM d, yyyy')}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteReport.mutate(report.id)}
                    disabled={deleteReport.isPending}
                    className="text-muted-foreground hover:text-foreground rounded-xl h-8 text-xs"
                  >
                    <Eye className="h-3.5 w-3.5 mr-1" />
                    Dismiss
                  </Button>
                  {report.confessions && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" className="gap-1 rounded-xl h-8 text-xs">
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Confession?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete the confession and all associated reports. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteConfession.mutate(report.confession_id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function AdminList({ admins, currentUserId, removeAdmin }: {
  admins: AdminUser[];
  currentUserId?: string;
  removeAdmin: ReturnType<typeof useMutation>;
}) {
  if (admins.length === 0) {
    return <p className="text-center text-muted-foreground py-8">No admins found.</p>;
  }

  return (
    <div className="space-y-2">
      {admins.map((admin, index) => (
        <div
          key={admin.id}
          className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-border/30 hover:border-primary/20 hover:bg-muted/30 transition-all duration-200"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <Shield className="h-4 w-4 text-primary" />
            </div>
            <div>
              <span className="text-sm font-bold">{admin.email}</span>
              {admin.user_id === currentUserId && (
                <Badge className="text-[10px] ml-2 bg-primary/10 text-primary border-primary/20 hover:bg-primary/10">You</Badge>
              )}
            </div>
          </div>
          {admin.user_id !== currentUserId && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl">
                  <X className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Remove Admin?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will revoke admin privileges from {admin.email}.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => removeAdmin.mutate(admin.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Remove
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      ))}
    </div>
  );
}

// --- Main Dashboard ---

export default function AdminDashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);

  useInactivityTimeout({ timeoutMs: 15 * 60 * 1000 });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate('/admin'); return; }
      setUser(session.user);

      const { data: roleData } = await supabase
        .from('user_roles').select('role').eq('user_id', session.user.id).maybeSingle();

      if (!roleData || roleData.role !== 'admin') {
        toast({ title: 'Access denied', description: 'You do not have admin privileges.', variant: 'destructive' });
        await supabase.auth.signOut();
        navigate('/admin');
        return;
      }
      setIsAdmin(true);
      setIsLoading(false);
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') navigate('/admin');
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const { data: reports, isLoading: reportsLoading } = useQuery({
    queryKey: ['admin-reports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reports').select('*, confessions (*)').order('created_at', { ascending: false });
      if (error) throw error;
      return data as ReportWithConfession[];
    },
    enabled: isAdmin,
  });

  const { data: admins, isLoading: adminsLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase.from('user_roles').select('id, user_id').eq('role', 'admin');
      if (error) throw error;
      const adminUsers: AdminUser[] = [];
      for (const role of data) {
        const { data: userEmail } = await supabase.rpc('get_user_email_by_id', { user_id_input: role.user_id });
        adminUsers.push({ id: role.id, user_id: role.user_id, email: userEmail || 'Unknown' });
      }
      return adminUsers;
    },
    enabled: isAdmin,
  });

  const addAdmin = useMutation({
    mutationFn: async (email: string) => {
      const { data: userId, error: searchError } = await supabase
        .rpc('get_user_id_by_email', { email_input: email }) as { data: string | null; error: Error | null };
      if (searchError || !userId) throw new Error('User not found. They must sign up first.');
      const { data: existing } = await supabase
        .from('user_roles').select('id').eq('user_id', userId).eq('role', 'admin').maybeSingle();
      if (existing) throw new Error('User is already an admin.');
      const { error } = await supabase.from('user_roles').insert([{ user_id: userId, role: 'admin' as const }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setNewAdminEmail('');
      setIsAddAdminOpen(false);
      toast({ title: 'Admin added', description: 'The user now has admin privileges.' });
    },
    onError: (error: Error) => {
      toast({ title: 'Failed to add admin', description: error.message, variant: 'destructive' });
    },
  });

  const removeAdmin = useMutation({
    mutationFn: async (adminId: string) => {
      const { error } = await supabase.from('user_roles').delete().eq('id', adminId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({ title: 'Admin removed', description: 'Admin privileges have been revoked.' });
    },
  });

  const deleteReport = useMutation({
    mutationFn: async (reportId: string) => {
      const { error } = await supabase.from('reports').delete().eq('id', reportId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reports'] });
      toast({ title: 'Report dismissed', description: 'The report has been removed.' });
    },
  });

  const deleteConfession = useMutation({
    mutationFn: async (confessionId: string) => {
      const { error } = await supabase.from('confessions').delete().eq('id', confessionId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reports'] });
      queryClient.invalidateQueries({ queryKey: ['confessions'] });
      toast({ title: 'Confession deleted', description: 'The confession and all related reports have been removed.' });
    },
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="h-16 w-16 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center animate-pulse">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-primary animate-ping opacity-30" />
          </div>
          <p className="text-sm text-muted-foreground font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) return null;

  const pendingReportsCount = reports?.length || 0;
  const uniqueConfessions = new Set(reports?.map(r => r.confession_id));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/30 bg-background/60 backdrop-blur-2xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group">
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
              <span className="hidden sm:inline text-sm font-medium">Back</span>
            </Link>
            <div className="h-5 w-px bg-border/30" />
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary via-accent to-secondary flex items-center justify-center">
                  <Shield className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-primary border-2 border-background" />
              </div>
              <div>
                <span className="font-bold text-sm">Admin</span>
                <span className="text-muted-foreground text-sm font-normal ml-1 hidden sm:inline">Dashboard</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-muted/30 border border-border/30 px-3 py-1.5 rounded-xl">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs text-muted-foreground font-medium">{user?.email}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2 text-muted-foreground hover:text-foreground rounded-xl">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline text-xs">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome banner */}
        <div className="relative overflow-hidden rounded-3xl border border-border/30 bg-gradient-to-br from-primary/[0.04] via-background to-accent/[0.04] p-8 md:p-10">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-72 h-72 -translate-y-1/3 translate-x-1/3">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-primary/[0.06] to-transparent blur-3xl" />
          </div>
          <div className="absolute bottom-0 left-0 w-48 h-48 translate-y-1/3 -translate-x-1/4">
            <div className="w-full h-full rounded-full bg-gradient-to-tr from-accent/[0.06] to-transparent blur-3xl" />
          </div>
          <div className="absolute top-6 right-8 opacity-[0.04]">
            <Sparkles className="h-32 w-32 text-primary" />
          </div>
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="h-4 w-4 text-primary" />
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary">Command Center</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">
              Welcome back<span className="gradient-text">, Admin</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-2 max-w-lg">
              Monitor activity, manage reports, and keep the community safe. Here's your overview.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard icon={Flag} label="Pending Reports" value={pendingReportsCount} iconClassName="text-destructive" gradient="bg-gradient-to-br from-destructive to-destructive/50" />
          <StatCard icon={AlertTriangle} label="Reported Confessions" value={uniqueConfessions.size} iconClassName="text-accent" gradient="bg-gradient-to-br from-accent to-accent/50" />
          <StatCard icon={Users} label="Admin Users" value={admins?.length || 0} gradient="bg-gradient-to-br from-primary to-secondary" />
        </div>

        {/* Analytics */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-bold uppercase tracking-[0.1em] text-muted-foreground">Analytics</h2>
          </div>
          <ConfessionTrendsChart />
        </div>

        {/* Reports */}
        <Card className="border-border/30 shadow-sm overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-destructive/[0.03] to-transparent">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-destructive/10 flex items-center justify-center">
                <Flag className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold">Reported Confessions</CardTitle>
                <CardDescription className="text-xs">Review and moderate flagged content</CardDescription>
              </div>
              {pendingReportsCount > 0 && (
                <Badge variant="destructive" className="ml-auto text-xs font-bold rounded-xl">
                  {pendingReportsCount} pending
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0 sm:p-6">
            {reportsLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <ReportsTable
                reports={reports || []}
                deleteReport={deleteReport}
                deleteConfession={deleteConfession}
              />
            )}
          </CardContent>
        </Card>

        {/* Admin Management */}
        <Card className="border-border/30 shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-primary/[0.03] to-transparent">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold">Admin Users</CardTitle>
                <CardDescription className="text-xs">Manage who has admin access</CardDescription>
              </div>
            </div>
            <Dialog open={isAddAdminOpen} onOpenChange={setIsAddAdminOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2 rounded-xl shadow-sm shadow-primary/20">
                  <UserPlus className="h-4 w-4" />
                  Add Admin
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Admin User</DialogTitle>
                  <DialogDescription>
                    Enter the email of a registered user to grant them admin access.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <Input
                    placeholder="user@example.com"
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    type="email"
                    className="rounded-xl"
                  />
                </div>
                <DialogFooter>
                  <Button
                    onClick={() => addAdmin.mutate(newAdminEmail)}
                    disabled={!newAdminEmail || addAdmin.isPending}
                    className="rounded-xl"
                  >
                    {addAdmin.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                    Add Admin
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {adminsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : (
              <AdminList admins={admins || []} currentUserId={user?.id} removeAdmin={removeAdmin} />
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
