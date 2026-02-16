import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, subDays, startOfDay, eachDayOfInterval, differenceInDays } from 'date-fns';
import { BarChart3, CalendarIcon, Download, Loader2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { TAG_LABELS } from '@/types/confession';
import type { DateRange } from 'react-day-picker';

const PRESETS = [
  { label: '7 days', days: 7 },
  { label: '14 days', days: 14 },
  { label: '30 days', days: 30 },
  { label: '90 days', days: 90 },
] as const;

function useTrendsData(from: Date, to: Date) {
  return useQuery({
    queryKey: ['admin-trends', from.toISOString(), to.toISOString()],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('confessions')
        .select('created_at, tag')
        .gte('created_at', from.toISOString())
        .lte('created_at', to.toISOString())
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
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const from = dateRange.from || subDays(new Date(), 30);
  const to = dateRange.to || new Date();
  const totalDays = differenceInDays(to, from) + 1;

  const { data: confessions, isLoading } = useTrendsData(startOfDay(from), to);

  const handlePreset = (days: number) => {
    setDateRange({ from: subDays(new Date(), days), to: new Date() });
  };

  // Daily trend data
  const allDays = eachDayOfInterval({ start: startOfDay(from), end: startOfDay(to) });
  const dailyMap = new Map<string, number>();
  allDays.forEach((d) => dailyMap.set(format(d, 'MMM d'), 0));
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

  const currentCount = confessions?.length || 0;
  const avgPerDay = totalDays > 0 ? (currentCount / totalDays).toFixed(1) : '0';

  const exportCsv = () => {
    if (!confessions?.length) return;
    const header = 'Date,Tag,Content Date\n';
    const rows = confessions.map((c) =>
      `"${format(new Date(c.created_at), 'yyyy-MM-dd HH:mm:ss')}","${c.tag}","${format(new Date(c.created_at), 'MMM d, yyyy')}"`
    ).join('\n');
    const summaryRows = dailyData.map((d) => `"${d.date}","daily_count","${d.count}"`).join('\n');
    const blob = new Blob(
      [`--- Raw Data ---\nDate,Tag,Formatted Date\n${rows}\n\n--- Daily Summary ---\nDate,Type,Count\n${summaryRows}`],
      { type: 'text/csv' }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `confessions-analytics-${format(from, 'yyyy-MM-dd')}-to-${format(to, 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Date range controls */}
      <div className="flex flex-wrap items-center gap-2">
        {PRESETS.map((p) => (
          <Button
            key={p.days}
            variant={totalDays === p.days + 1 ? 'default' : 'outline'}
            size="sm"
            className="rounded-xl text-xs h-8"
            onClick={() => handlePreset(p.days)}
          >
            {p.label}
          </Button>
        ))}
        <div className="flex items-center gap-2 ml-auto">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className={cn("rounded-xl text-xs h-8 gap-1.5")}>
                <CalendarIcon className="h-3.5 w-3.5" />
                {format(from, 'MMM d')} – {format(to, 'MMM d, yyyy')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={(range) => range && setDateRange(range)}
                numberOfMonths={2}
                disabled={(date) => date > new Date()}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl text-xs h-8 gap-1.5"
            onClick={exportCsv}
            disabled={!confessions?.length}
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Summary row */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase tracking-wider font-medium">Selected Period</CardDescription>
            <CardTitle className="text-3xl font-extrabold">
              {isLoading ? <Loader2 className="h-6 w-6 animate-spin text-primary" /> : currentCount}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-muted-foreground">Total confessions ({totalDays} days)</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase tracking-wider font-medium">Daily Average</CardDescription>
            <CardTitle className="text-3xl font-extrabold">
              {isLoading ? <Loader2 className="h-6 w-6 animate-spin text-primary" /> : avgPerDay}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-muted-foreground">Confessions per day</p>
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
        <Card className="border-border/50 lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Daily Confessions</CardTitle>
                <CardDescription className="text-xs">
                  {format(from, 'MMM d')} – {format(to, 'MMM d, yyyy')}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-[260px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
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
                      interval={totalDays > 60 ? Math.floor(totalDays / 10) : 'preserveStartEnd'}
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
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Categories</CardTitle>
            <CardDescription className="text-xs">Tag distribution</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-[200px]">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : tagData.length === 0 ? (
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
