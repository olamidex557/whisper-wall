import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Shield, Trash2, LogOut, ArrowLeft, Flag, AlertTriangle, CheckCircle, Loader2, UserPlus, Users, X, Sparkles } from 'lucide-react';
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

function StatCard({ icon: Icon, label, value, iconClassName }: {
  icon: React.ElementType; label: string; value: number; iconClassName?: string;
}) {
  return (
    <Card className="relative overflow-hidden group hover:border-primary/30 transition-colors">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <CardHeader className="pb-2 relative">
        <CardDescription className="text-xs uppercase tracking-wider font-medium">{label}</CardDescription>
        <CardTitle className="text-4xl font-extrabold flex items-center gap-3 mt-1">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Icon className={`h-5 w-5 ${iconClassName || 'text-primary'}`} />
          </div>
          {value}
        </CardTitle>
      </CardHeader>
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
      <div className="text-center py-16 text-muted-foreground">
        <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-primary" />
        </div>
        <p className="text-lg font-semibold text-foreground">All clear!</p>
        <p className="text-sm mt-1">No pending reports to review.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-border/50 hover:bg-transparent">
            <TableHead className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Confession</TableHead>
            <TableHead className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Tag</TableHead>
            <TableHead className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Reason</TableHead>
            <TableHead className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Date</TableHead>
            <TableHead className="text-xs uppercase tracking-wider font-semibold text-muted-foreground text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((report) => (
            <TableRow key={report.id} className="border-border/30 hover:bg-muted/30 transition-colors">
              <TableCell className="max-w-xs">
                <p className="truncate font-medium">{report.confessions?.content || 'Deleted'}</p>
              </TableCell>
              <TableCell>
                {report.confessions && (
                  <Badge variant="outline" className="border-primary/30 text-primary text-xs">
                    {TAG_LABELS[report.confessions.tag as keyof typeof TAG_LABELS]}
                  </Badge>
                )}
              </TableCell>
              <TableCell className="max-w-xs">
                <p className="truncate text-muted-foreground">{report.reason}</p>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {format(new Date(report.created_at), 'MMM d, yyyy')}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteReport.mutate(report.id)}
                    disabled={deleteReport.isPending}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Dismiss
                  </Button>
                  {report.confessions && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" className="gap-1.5">
                          <Trash2 className="h-3.5 w-3.5" />
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
      {admins.map((admin) => (
        <div
          key={admin.id}
          className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/30 hover:border-primary/20 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <Shield className="h-4 w-4 text-primary" />
            </div>
            <div>
              <span className="text-sm font-semibold">{admin.email}</span>
              {admin.user_id === currentUserId && (
                <Badge variant="secondary" className="text-xs ml-2">You</Badge>
              )}
            </div>
          </div>
          {admin.user_id !== currentUserId && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
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
          <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
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
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline text-sm">Back</span>
            </Link>
            <div className="h-5 w-px bg-border/50" />
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Shield className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <span className="font-bold text-sm">Admin Dashboard</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground hidden sm:inline bg-muted/50 px-3 py-1.5 rounded-full">
              {user?.email}
            </span>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2 text-muted-foreground hover:text-foreground">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome banner */}
        <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 p-6">
          <div className="absolute top-4 right-4 opacity-10">
            <Sparkles className="h-24 w-24 text-primary" />
          </div>
          <div className="relative">
            <h1 className="text-2xl font-extrabold tracking-tight">
              Welcome back<span className="gradient-text">, Admin</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage reports, moderate content, and keep the community safe.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard icon={Flag} label="Pending Reports" value={pendingReportsCount} iconClassName="text-destructive" />
          <StatCard icon={AlertTriangle} label="Reported Confessions" value={uniqueConfessions.size} iconClassName="text-accent" />
          <StatCard icon={Users} label="Admin Users" value={admins?.length || 0} />
        </div>

        {/* Analytics */}
        <ConfessionTrendsChart />

        {/* Reports */}
        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-destructive/10 flex items-center justify-center">
                <Flag className="h-4 w-4 text-destructive" />
              </div>
              <div>
                <CardTitle className="text-lg">Reported Confessions</CardTitle>
                <CardDescription className="text-xs">Review and moderate reported content</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
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
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Admin Users</CardTitle>
                <CardDescription className="text-xs">Manage who has admin access</CardDescription>
              </div>
            </div>
            <Dialog open={isAddAdminOpen} onOpenChange={setIsAddAdminOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2 rounded-xl">
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
