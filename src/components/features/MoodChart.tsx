'use client';

import { useMemo, useCallback } from 'react';
import { SupabaseMoodLog } from '@/types';
import { LineChart, Line, XAxis, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';

export function MoodChart({ logs }: { logs: SupabaseMoodLog[] }) {
  // Sort chronologically for chart
  const chartData = useMemo(() => {
    if (!logs) return [];
    return [...logs].reverse().map(log => ({
      date: format(parseISO(log.logged_at!), 'EEE'), // Mon, Tue
      score: log.mood_score,
      fullDate: format(parseISO(log.logged_at!), 'MMM d, yyyy')
    }));
  }, [logs]);

  // A custom dot for the chart that mimics the screenshot (white filled circle with a small indigo dot inside)
  const CustomDot = useCallback((props: any) => {
    const { cx, cy } = props;
    if (cx == null || cy == null) return null;
    return (
      <g>
        <circle cx={cx} cy={cy} r={8} fill="white" stroke="#E5E7EB" strokeWidth={1} />
        <circle cx={cx} cy={cy} r={3} fill="#4F46E5" />
      </g>
    );
  }, []);

  if (!logs || logs.length === 0) {
    return (
      <div className="h-[250px] flex items-center justify-center bg-[#F9FAFB] rounded-2xl border border-[#F3F4F6]">
        <p className="text-[#9CA3AF] text-sm">Not enough data to show chart yet.</p>
      </div>
    );
  }

  return (
    <div className="h-[250px] w-full mt-8">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 0 }}>
          <XAxis 
            dataKey="date" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#D1D5DB' }}
            dy={10}
          />
          {/* Hide YAxis entirely, we just want the curve */}
          <Line 
            type="monotone" 
            dataKey="score" 
            stroke="#4F46E5" 
            strokeWidth={14}
            dot={<CustomDot />}
            activeDot={false}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
