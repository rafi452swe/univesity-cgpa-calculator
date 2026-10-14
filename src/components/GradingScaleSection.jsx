import React from 'react';
import { Award } from 'lucide-react';
import { GRADING_SCALE } from '../constants/gradingScale';

export default function GradingScaleSection() {
  return (
    <section className="bg-[#0D1422] rounded-2xl border border-[#1E293B] p-6 lg:p-8 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
          <Award className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white m-0">Official Grading Scale (4.00)</h2>
          <p className="text-sm text-slate-400 m-0">Authoritative university grade points and mark distribution</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[#1E293B]">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-[#111B2C] text-xs uppercase tracking-wider text-slate-400 border-b border-[#1E293B]">
            <tr>
              <th scope="col" className="px-4 py-3.5 font-semibold">Marks Range</th>
              <th scope="col" className="px-4 py-3.5 font-semibold text-center">Letter Grade</th>
              <th scope="col" className="px-4 py-3.5 font-semibold text-right">Grade Point</th>
              <th scope="col" className="px-4 py-3.5 font-semibold">Performance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1E293B]">
            {GRADING_SCALE.map((row) => (
              <tr 
                key={row.letterGrade} 
                className="hover:bg-[#111B2C]/50 transition-colors"
              >
                <td className="px-4 py-3 font-mono text-slate-300 font-medium">
                  {row.marksRange}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    row.gradePoint >= 3.5 
                      ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                      : row.gradePoint >= 2.5
                      ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                      : row.gradePoint >= 2.0
                      ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                      : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                  }`}>
                    {row.letterGrade}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-mono font-bold text-white">
                  {row.gradePoint.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-slate-300 font-medium">
                  {row.performance}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
