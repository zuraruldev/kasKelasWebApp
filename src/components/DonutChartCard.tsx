'use client';

interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

interface DonutChartCardProps {
  title: string;
  subtitle?: string;
  segments: [DonutSegment, DonutSegment];
  badge1: { label: string; value: string | number; bg: string };
  badge2: { label: string; value: string | number; bg: string };
  badge3: { label: string; value: string | number; bg: string };
}

export default function DonutChartCard({
  title,
  subtitle = 'Proporsi Keuangan Kas',
  segments,
  badge1,
  badge2,
  badge3,
}: DonutChartCardProps) {
  const total = segments[0].value + segments[1].value;
  const radius = 65;
  const strokeWidth = 32;
  const circumference = 2 * Math.PI * radius;

  const seg1Ratio = total > 0 ? segments[0].value / total : 0.5;
  const seg2Ratio = total > 0 ? segments[1].value / total : 0.5;

  const seg1Length = circumference * seg1Ratio;
  const seg2Length = circumference * seg2Ratio;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between h-full">
      {/* Card Header with Title */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h3 className="font-bold text-slate-800 text-sm">{title}</h3>
          <p className="text-[11px] text-slate-400">{subtitle}</p>
        </div>
        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
          Grafik Kas
        </span>
      </div>

      {/* Donut Chart Display */}
      <div className="flex flex-col items-center justify-center py-6">
        <div className="relative w-44 h-44 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 origin-center" viewBox="0 0 180 180">
            {/* Background circle track */}
            <circle
              cx="90"
              cy="90"
              r={radius}
              fill="transparent"
              stroke="#f1f5f9"
              strokeWidth={strokeWidth}
            />

            {/* Segment 1: Kas Masuk */}
            <circle
              cx="90"
              cy="90"
              r={radius}
              fill="transparent"
              stroke={segments[0].color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${seg1Length} ${circumference - seg1Length}`}
              strokeDashoffset="0"
              className="transition-all duration-500"
            />

            {/* Segment 2: Kas Keluar */}
            <circle
              cx="90"
              cy="90"
              r={radius}
              fill="transparent"
              stroke={segments[1].color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${seg2Length} ${circumference - seg2Length}`}
              strokeDashoffset={-seg1Length}
              className="transition-all duration-500"
            />
          </svg>

          {/* Center Text inside Donut */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Rasio</span>
            <span className="text-sm font-extrabold text-slate-800">
              {Math.round(seg1Ratio * 100)}% : {Math.round(seg2Ratio * 100)}%
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 mt-4 text-xs font-medium text-slate-600">
          <div className="flex items-center gap-2">
            <span
              className="w-3.5 h-2.5 rounded-xs inline-block"
              style={{ backgroundColor: segments[0].color }}
            />
            <span>{segments[0].label} ({Math.round(seg1Ratio * 100)}%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="w-3.5 h-2.5 rounded-xs inline-block"
              style={{ backgroundColor: segments[1].color }}
            />
            <span>{segments[1].label} ({Math.round(seg2Ratio * 100)}%)</span>
          </div>
        </div>
      </div>

      {/* Bottom Summary Badges */}
      <div className="flex items-center justify-center gap-2 pt-3 border-t border-slate-100 flex-wrap">
        <span
          className="text-white text-xs font-bold px-2.5 py-1 rounded shadow-2xs"
          style={{ backgroundColor: badge1.bg }}
        >
          {badge1.label}: {badge1.value}
        </span>
        <span
          className="text-white text-xs font-bold px-2.5 py-1 rounded shadow-2xs"
          style={{ backgroundColor: badge2.bg }}
        >
          {badge2.label}: {badge2.value}
        </span>
        <span
          className="text-white text-xs font-bold px-2.5 py-1 rounded shadow-2xs"
          style={{ backgroundColor: badge3.bg }}
        >
          {badge3.label}: {badge3.value}
        </span>
      </div>
    </div>
  );
}
