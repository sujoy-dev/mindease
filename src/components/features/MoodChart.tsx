'use client';

import { SupabaseMoodLog } from '@/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MOOD_SCALE } from '@/constants/moodScale';
import { format, parseISO } from 'date-fns';

export function MoodChart({ logs }: { logs: SupabaseMoodLog[] }) {
  if (!logs || logs.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-xl border border-gray-100">
        <p className="text-gray-500 text-sm">Not enough data to show chart yet.</p>
      </div>
    );
  }

  // Sort chronologically for chart
  const chartData = [...logs].reverse().map(log => ({
    date: format(parseISO(log.logged_at!), 'MMM d'),
    score: log.mood_score,
    fullDate: format(parseISO(log.logged_at!), 'MMM d, yyyy')
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const moodInfo = MOOD_SCALE.find(m => m.value === data.score);
      return (
        <div className="bg-white p-3 border border-gray-100 rounded-lg shadow-lg">
          <p className="text-xs text-gray-500 mb-1">{data.fullDate}</p>
          <div className="flex items-center gap-2">
            <span className="text-xl">{moodInfo?.emoji}</span>
            <span className="font-semibold text-gray-900">{moodInfo?.label}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
          <XAxis 
            dataKey="date" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6B7280' }}
            dy={10}
          />
          <YAxis 
            domain={[1, 5]} 
            ticks={[1, 2, 3, 4, 5]}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6B7280' }}
            tickFormatter={(val) => MOOD_SCALE.find(m => m.value === val)?.emoji || ''}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="score" 
            stroke="var(--color-primary)" 
            strokeWidth={3}
            dot={{ r: 4, fill: 'var(--color-primary)', strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 6, fill: 'var(--color-primary)', strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
