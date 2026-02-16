import { useQuery } from '@tanstack/react-query';
import { format, subDays, startOfDay } from 'date-fns';
import { BarChart3, Loader2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { TAG_LABELS } from '@/types/confession';

function useTrendsData() {
  return useQuery({
    queryKey: ['admin-trends'],
    queryFn: async () => {
      const thirtyDaysAgo = subDays(new Date(), 30).toISOString();
      const { data, error } = await supabase
        .from('confessions')
        .select('created_at, tag')
        .gte('created_at', thirtyDaysAgo)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data;
    },
  });
}

const TAG_CHART_COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--accent))',
  'hsl(var(--destructive))',
  'hsl(var(--secondary))',
  'hsl(var(--muted-foreground))',
  'hsl(var(--primary) / 0.6)',
  'hsl(var(--accent) / 0.6)',
  'hsl(var(--destructive) / 0.6)',
];

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border/50 bg-background px-3 py-2 text-xs shadow-xl">
      <p className="font-medium text-foreground mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-muted-foreground">
          {p.name}: <span className="font-semibold text-foreground">{p.value}</span>
        </p>
      ))}
    </div>
  );
}

export default function ConfessionTrendsChart() {
  const { data: confessions, isLoading } = useTrendsData();

  if (isLoading) {
    return (
      <Card className="border-border/50">
        <CardContent className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  // Daily trend data
  const dailyMap = new Map<string, number>();
  for (let i = 29; i >= 0; i--) {
    const key = format(startOfDay(subDays(new Date(), i)), 'MMM d');
    dailyMap.set(key, 0);
  }
  confessions?.forEach((c) => {
    const key = format(new Date(c.created_at), 'MMM d');
    if (dailyMap.has(key)) dailyMap.set(key, (dailyMap.get(key) || 0) + 1);
  });
  const dailyData = Array.from(dailyMap, ([date, count]) => ({ date, count }));

  // Tag distribution
  const tagMap = new Map<string, number>();
  confessions?.forEach((c) => {
    tagMap.set(c.tag, (tagMap.get(c.tag) || 0) + 1);
  });
  const tagData = Array.from(tagMap, ([tag, count]) => ({
    name: TAG_LABELS[tag as keyof typeof TAG_LABELS] || tag,
    value: count,
  })).sort((a, b) => b.value - a.value);

  // Weekly comparison (this week vs last week)
  const now = new Date();
  const thisWeekStart = subDays(now, 7);
  const lastWeekStart = subDays(now, 14);
  const thisWeek = confessions?.filter(c => new Date(c.created_at) >= thisWeekStart).length || 0;
  const lastWeek = confessions?.filter(c => {
    const d = new Date(c.created_at);
    return d >= lastWeekStart && d < thisWeekStart;
  }).length || 0;
  const weeklyChange = lastWeek > 0 ? Math.round(((thisWeek - lastWeek) / lastWeek) * 100) : thisWeek > 0 ? 100 : 0;

  return (
    <div className="space-y-4">
      {/* Summary row */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase tracking-wider font-medium">Last 30 Days</CardDescription>
            <CardTitle className="text-3xl font-extrabold">{confessions?.length || 0}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-muted-foreground">Total confessions</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase tracking-wider font-medium">This Week</CardDescription>
            <CardTitle className="text-3xl font-extrabold">{thisWeek}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className={`text-xs font-medium ${weeklyChange >= 0 ? 'text-primary' : 'text-destructive'}`}>
              {weeklyChange >= 0 ? '↑' : '↓'} {Math.abs(weeklyChange)}% vs last week
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase tracking-wider font-medium">Top Category</CardDescription>
            <CardTitle className="text-xl font-extrabold">{tagData[0]?.name || 'N/A'}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-muted-foreground">{tagData[0]?.value || 0} confessions</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Area chart - daily trend */}
        <Card className="border-border/50 lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Daily Confessions</CardTitle>
                <CardDescription className="text-xs">Submissions over the last 30 days</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                    tickLine={false}
                    axisLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="count"
                    name="Confessions"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorCount)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pie chart - tag distribution */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Categories</CardTitle>
            <CardDescription className="text-xs">Tag distribution</CardDescription>
          </CardHeader>
          <CardContent>
            {tagData.length === 0 ? (
              <p className="text-center text-muted-foreground py-8 text-sm">No data yet</p>
            ) : (
              <>
                <div className="h-[160px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={tagData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={3}
                        dataKey="value"
                        strokeWidth={0}
                      >
                        {tagData.map((_, i) => (
                          <Cell key={i} fill={TAG_CHART_COLORS[i % TAG_CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-1.5 mt-2">
                  {tagData.slice(0, 5).map((tag, i) => (
                    <div key={tag.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-2.5 w-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: TAG_CHART_COLORS[i % TAG_CHART_COLORS.length] }}
                        />
                        <span className="text-muted-foreground truncate">{tag.name}</span>
                      </div>
                      <span className="font-semibold">{tag.value}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
