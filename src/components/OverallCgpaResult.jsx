import React from 'react';
import { Layers, Calendar, Sparkles } from 'lucide-react';

export default function OverallCgpaResult({ result, isOutdated }) {
  if (!result || !result.isValid) return null;

  const { cgpa, totalCredits, totalSemesters, breakdown } = result;

  // Calculate SVG circular ring percentage based on 4.00 scale
  const percentage = Math.min(Math.max((cgpa / 4.0) * 100, 0), 100);
  const radius = 64;
  const circumference = 2 * Math.PI * radius; // ~402.12
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={`mt-8 space-y-6 transition-all duration-500 ${isOutdated ? 'opacity-70 grayscale-[30%]' : 'opacity-100'}`}>
      {isOutdated && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-center text-xs font-semibold text-amber-300">
          ⚠️ Semester inputs have changed. Click &quot;See Result&quot; again to refresh your Overall CGPA.
        </div>
      )}

      {/* Main CGPA Result Dashboard Card */}
      <div className="bg-[#0D1422] rounded-2xl border border-blue-500/30 p-6 lg:p-8 shadow-2xl relative overflow-hidden glow-blue">
        {/* Ambient glow backgrounds */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
          
          {/* Circular CGPA Ring */}
          <div className="flex flex-col items-center">
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                {/* Background Ring Track */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="#1E293B"
                  strokeWidth="12"
                  fill="transparent"
                />
                {/* Animated CGPA Value Ring */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="url(#blueMintPurpleGradient)"
                  strokeWidth="12"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="animate-ring"
                />
                <defs>
                  <linearGradient id="blueMintPurpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="50%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#34D399" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Center Content */}
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-mono">
                  {cgpa.toFixed(2)}
                </span>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-0.5">
                  / 4.00
                </span>
              </div>
            </div>

            {/* Neutral Performance Label */}
            <div className="mt-3 text-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/30">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                Overall Result
              </span>
            </div>
          </div>

          {/* Summary Cards (NO Quality Points shown anywhere) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full lg:w-2/3">
            <div className="bg-[#111B2C]/80 border border-[#1E293B] rounded-xl p-5 flex items-center gap-4 hover:border-blue-500/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold m-0">Total Semesters</p>
                <p className="text-2xl font-bold text-white font-mono mt-0.5 m-0">{totalSemesters}</p>
                <p className="text-xs text-slate-500 mt-1 m-0">Completed academic terms</p>
              </div>
            </div>

            <div className="bg-[#111B2C]/80 border border-[#1E293B] rounded-xl p-5 flex items-center gap-4 hover:border-purple-500/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold m-0">Total Credits</p>
                <p className="text-2xl font-bold text-white font-mono mt-0.5 m-0">{totalCredits}</p>
                <p className="text-xs text-slate-500 mt-1 m-0">Cumulative completed credits</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Semester-wise GPA Chart */}
      <div className="bg-[#0D1422] rounded-2xl border border-[#1E293B] p-6 lg:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="text-lg font-bold text-white m-0">Semester-wise GPA</h3>
            <p className="text-xs text-slate-400 mt-0.5 m-0">
              GPA progression across all completed semesters (vertical scale 0.00 – 4.00, sorted numerically)
            </p>
          </div>
          <span className="text-xs font-semibold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20 w-fit">
            Scale: 0.00 – 4.00
          </span>
        </div>

        {/* Responsive Bar Chart using pure SVG & HTML for pixel-perfect responsiveness & styling */}
        <div className="pt-4 pb-2">
          {/* Y-axis grid lines with GPA scale reference */}
          <div className="relative h-56 flex flex-col justify-between border-l border-b border-[#1E293B] pl-2 pb-1">
            {[4.00, 3.00, 2.00, 1.00, 0.00].map((tick) => (
              <div key={tick} className="flex items-center w-full">
                <span className="text-[10px] font-mono text-slate-500 -ml-8 w-6 text-right select-none">
                  {tick.toFixed(2)}
                </span>
                <div className="w-full border-t border-[#1E293B]/60 border-dashed ml-2" />
              </div>
            ))}

            {/* Bars container positioned inside graph */}
            <div className="absolute inset-0 left-6 flex items-end justify-around gap-2 sm:gap-4 px-2">
              {breakdown.map((sem) => {
                const heightPercent = Math.min(Math.max((sem.gpa / 4.0) * 100, 0), 100);

                return (
                  <div key={sem.semesterNumber} className="flex flex-col items-center flex-1 max-w-[64px] h-full justify-end group">
                    {/* Tooltip on hover / value on top */}
                    <span className="text-[11px] font-mono font-bold text-white mb-1 group-hover:scale-110 group-hover:text-emerald-400 transition-all">
                      {sem.gpa.toFixed(2)}
                    </span>

                    {/* Bar */}
                    <div className="w-full bg-[#111B2C] rounded-t-lg overflow-hidden border-t border-x border-[#1E293B] p-0.5 flex flex-col justify-end" style={{ height: `${heightPercent}%` }}>
                      <div className="w-full h-full rounded-t-md bg-gradient-to-t from-blue-600 via-purple-600 to-emerald-400 group-hover:from-blue-500 group-hover:to-emerald-300 transition-all duration-500 shadow-md shadow-purple-900/30" />
                    </div>

                    {/* Semester Label beneath bar */}
                    <span className="text-[10px] sm:text-xs font-semibold text-slate-400 mt-2 truncate max-w-full group-hover:text-white transition-colors">
                      Sem {sem.semesterNumber}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Semester-wise Breakdown List */}
      <div className="bg-[#0D1422] rounded-2xl border border-[#1E293B] p-6 lg:p-8 shadow-xl">
        <h3 className="text-lg font-bold text-white mb-1">Semester-wise Breakdown</h3>
        <p className="text-xs text-slate-400 mb-6">
          Detailed performance breakdown by term (sorted in ascending order)
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {breakdown.map((sem) => (
            <div
              key={sem.semesterNumber}
              className="p-4 rounded-xl bg-[#111B2C]/70 border border-[#1E293B] flex items-center justify-between hover:border-purple-500/40 transition-colors"
            >
              <div>
                {/* Full label e.g. Semester 1 */}
                <h4 className="text-sm font-bold text-white m-0">
                  {sem.semesterLabel}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5 m-0">
                  {sem.credit} Credits completed
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs uppercase tracking-wider text-slate-500 block font-semibold">
                  Semester GPA
                </span>
                <span className="text-base font-extrabold text-emerald-400 font-mono">
                  {sem.gpa.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
