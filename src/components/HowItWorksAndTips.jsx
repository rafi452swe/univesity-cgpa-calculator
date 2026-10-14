import React from 'react';
import { HelpCircle, Lightbulb, CheckCircle2 } from 'lucide-react';

export function HowItWorksSection({ type = 'semester' }) {
  const isSemester = type === 'semester';

  return (
    <section className="bg-[#0D1422] rounded-2xl border border-[#1E293B] p-6 lg:p-8 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
          <HelpCircle className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white m-0">How It Works?</h2>
          <p className="text-sm text-slate-400 m-0">
            {isSemester ? 'Step-by-step guide to calculating Semester GPA' : 'Step-by-step guide to calculating Overall CGPA'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        {isSemester ? (
          <>
            <StepItem number="1" title="Add Course" text="Add a row for each course in the semester." />
            <StepItem number="2" title="Credit Hour" text="Enter the numeric Credit Hour for the course." />
            <StepItem number="3" title="Grade Point" text="Select the official Grade Point received." />
            <StepItem number="4" title="See Result" text="Click See Result to calculate your GPA." />
            <StepItem number="5" title="View GPA" text="Inspect your calculated weighted Semester GPA." />
          </>
        ) : (
          <>
            <StepItem number="1" title="Add Semester" text="Add each completed university semester." />
            <StepItem number="2" title="Semester No." text="Enter the positive integer semester number." />
            <StepItem number="3" title="Total Credit" text="Enter the total completed credit hours." />
            <StepItem number="4" title="Semester GPA" text="Enter the achieved GPA for that semester." />
            <StepItem number="5" title="View CGPA" text="Click See Result to view credit-weighted CGPA." />
          </>
        )}
      </div>

      {/* Formula Box */}
      <div className="p-5 rounded-xl bg-[#111B2C] border border-[#1E293B] flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-purple-400 font-semibold mb-1">
            Official Mathematical Formula
          </div>
          <div className="font-mono text-base sm:text-lg font-bold text-white tracking-wide">
            {isSemester
              ? 'Semester GPA = Σ(Credit Hour × Grade Point) / Σ(Credit Hour)'
              : 'Overall CGPA = Σ(Total Credit × Semester GPA) / Σ(Total Credit)'}
          </div>
        </div>
        <div className="text-xs text-slate-400 max-w-xs text-center md:text-right">
          {isSemester
            ? 'Each course grade is multiplied by its credits, summed, and divided by total credits.'
            : 'Each semester GPA is weighted strictly by its credit count, not a simple average.'}
        </div>
      </div>
    </section>
  );
}

function StepItem({ number, title, text }) {
  return (
    <div className="bg-[#111B2C]/70 border border-[#1E293B] p-4 rounded-xl flex flex-col relative group hover:border-purple-500/40 transition-colors">
      <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-blue-600 text-white font-bold text-xs flex items-center justify-center mb-2 shadow-md">
        {number}
      </div>
      <h3 className="text-sm font-semibold text-white mb-1">{title}</h3>
      <p className="text-xs text-slate-400 leading-relaxed">{text}</p>
    </div>
  );
}

export function HelpfulTipsSection({ type = 'semester' }) {
  const isSemester = type === 'semester';

  const semesterTips = [
    'Enter the correct credit hour for each completed course.',
    'Select the grade point that matches your officially awarded course grade.',
    'Remove unused or blank rows to keep your data accurate.',
    'Review the official grading scale table below to verify grade points.',
    'Click See Result again after making any changes to update your calculation.',
  ];

  const cgpaTips = [
    'Use a positive whole-number Semester Number (e.g., 1, 2, 3).',
    'Enter the accurate semester credit total for each completed semester.',
    'Enter the semester GPA accurately between 0.00 and 4.00.',
    'Avoid duplicate semester numbers to prevent validation errors.',
    'Click See Result again after changing any semester details to refresh your CGPA.',
  ];

  const tips = isSemester ? semesterTips : cgpaTips;

  return (
    <section className="bg-[#0D1422] rounded-2xl border border-[#1E293B] p-6 lg:p-8 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-mint-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
          <Lightbulb className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white m-0">Helpful Tips</h2>
          <p className="text-sm text-slate-400 m-0">Best practices for flawless CGPA calculation</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {tips.map((tip, idx) => (
          <div 
            key={idx} 
            className="flex items-start gap-3 p-3.5 rounded-xl bg-[#111B2C]/50 border border-[#1E293B] hover:border-blue-500/30 transition-colors"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              {tip}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
