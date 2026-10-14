import React from 'react';
import { Calculator, Award } from 'lucide-react';

export default function Header({ activeTab, onTabChange }) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#070B14]/85 border-b border-[#1E293B] shadow-lg shadow-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-4 gap-4">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-blue-600 to-indigo-500 p-0.5 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <div className="w-full h-full bg-[#0D1422] rounded-[10px] flex items-center justify-center">
                <Calculator className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2 m-0 p-0">
                <span>University CGPA Calculator</span>
                <span className="hidden sm:inline-block text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  4.0 Scale
                </span>
              </h1>
              <p className="text-xs text-slate-400 m-0 p-0">Accurate & Credit-Weighted Academic GPA Tools</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav aria-label="Calculator navigation" className="flex items-center bg-[#0D1422] p-1.5 rounded-xl border border-[#1E293B]">
            <button
              type="button"
              onClick={() => onTabChange('semester')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === 'semester'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md shadow-purple-900/30 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#111B2C]'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Semester GPA</span>
            </button>

            <button
              type="button"
              onClick={() => onTabChange('overall')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === 'overall'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md shadow-purple-900/30 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#111B2C]'
              }`}
            >
              <Calculator className="w-4 h-4" />
              <span>Overall CGPA</span>
            </button>
          </nav>

        </div>
      </div>
    </header>
  );
}
