import React from 'react';
import { BookOpen, Layers, Sparkles } from 'lucide-react';
import { getGradeInfoByPoint } from '../constants/gradingScale';

export default function SemesterGpaResult({ result, isOutdated }) {
  if (!result || !result.isValid) return null;

  const { gpa, totalCredits, totalCourses, distribution } = result;

  // Calculate SVG circular ring percentage based on 4.00 scale
  const percentage = Math.min(Math.max((gpa / 4.0) * 100, 0), 100);
  const radius = 64;
  const circumference = 2 * Math.PI * radius; // ~402.12
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Find max count in distribution for dynamic bar scaling
  const maxDistributionCount = distribution.length > 0
    ? Math.max(...distribution.map(d => d.count))
    : 1;

  return (
    <div className={`mt-8 space-y-6 transition-all duration-500 ${isOutdated ? 'opacity-70 grayscale-[30%]' : 'opacity-100'}`}>
      {isOutdated && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-center text-xs font-semibold text-amber-300">
          ⚠️ Inputs have changed. Click &quot;See Result&quot; again to refresh your Semester GPA.
        </div>
      )}

      {/* Main Result Dashboard Card */}
      <div className="bg-[#0D1422] rounded-2xl border border-purple-500/30 p-6 lg:p-8 shadow-2xl relative overflow-hidden glow-purple">
        {/* Glow ambient circle in background */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
          
          {/* Circular GPA Ring */}
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
                {/* Animated Value Ring */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="url(#purpleBlueMintGradient)"
                  strokeWidth="12"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="animate-ring"
                />
                <defs>
                  <linearGradient id="purpleBlueMintGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="50%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#34D399" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Center Content */}
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-mono">
                  {gpa.toFixed(2)}
                </span>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-0.5">
                  / 4.00
                </span>
              </div>
            </div>

            {/* Neutral Performance Label */}
            <div className="mt-3 text-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                Semester Result
              </span>
            </div>
          </div>

          {/* Summary Metric Cards (NO Quality Points shown) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full lg:w-2/3">
            <div className="bg-[#111B2C]/80 border border-[#1E293B] rounded-xl p-5 flex items-center gap-4 hover:border-purple-500/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold m-0">Total Courses</p>
                <p className="text-2xl font-bold text-white font-mono mt-0.5 m-0">{totalCourses}</p>
                <p className="text-xs text-slate-500 mt-1 m-0">Enrolled & completed courses</p>
              </div>
            </div>

            <div className="bg-[#111B2C]/80 border border-[#1E293B] rounded-xl p-5 flex items-center gap-4 hover:border-blue-500/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold m-0">Total Credits</p>
                <p className="text-2xl font-bold text-white font-mono mt-0.5 m-0">{totalCredits}</p>
                <p className="text-xs text-slate-500 mt-1 m-0">Accumulated semester credits</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Grade Point Distribution Chart Section */}
      <div className="bg-[#0D1422] rounded-2xl border border-[#1E293B] p-6 lg:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="text-lg font-bold text-white m-0">Grade Point Distribution</h3>
            <p className="text-xs text-slate-400 mt-0.5 m-0">
              Breakdown of courses grouped by selected numeric Grade Point (descending order)
            </p>
          </div>
          <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 w-fit">
            {distribution.length} Distinct Grade Point{distribution.length === 1 ? '' : 's'}
          </span>
        </div>

        {distribution.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-6">No distribution data available.</p>
        ) : (
          <div className="space-y-4">
            {distribution.map((item) => {
              const gradeInfo = getGradeInfoByPoint(item.gradePoint);
              const barWidthPercent = (item.count / maxDistributionCount) * 100;

              return (
                <div key={item.gradePointFormatted} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs sm:text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white text-base">
                        {item.gradePointFormatted}
                      </span>
                      {gradeInfo && (
                        <span className="px-2 py-0.5 rounded text-xs font-bold bg-[#111B2C] text-purple-300 border border-[#1E293B]">
                          Grade {gradeInfo.letterGrade}
                        </span>
                      )}
                    </div>
                    <span className="text-slate-300 font-mono">
                      <strong className="text-emerald-400 text-base">{item.count}</strong> {item.count === 1 ? 'course' : 'courses'}
                    </span>
                  </div>

                  {/* Responsive Progress Bar */}
                  <div className="w-full h-3.5 bg-[#111B2C] rounded-full overflow-hidden border border-[#1E293B] p-0.5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-500 via-blue-500 to-mint-400 transition-all duration-700"
                      style={{ width: `${barWidthPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
