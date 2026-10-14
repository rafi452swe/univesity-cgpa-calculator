import React from 'react';
import { Plus, Trash2, RotateCcw, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import OverallCgpaResult from '../components/OverallCgpaResult';
import GradingScaleSection from '../components/GradingScaleSection';
import { HowItWorksSection, HelpfulTipsSection } from '../components/HowItWorksAndTips';
import { calculateOverallCGPA } from '../utils/calculations';

const STORAGE_KEY = 'uni_cgpa_calc_overall_semesters_v1';

export default function OverallCgpaPage() {
  // Initial semester state
  const [semesters, setSemesters] = React.useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    // Start with blank input rows
    return [
      { id: 'sem-1', semesterNumber: '1', totalCredit: '', semesterGpa: '' },
      { id: 'sem-2', semesterNumber: '2', totalCredit: '', semesterGpa: '' },
      { id: 'sem-3', semesterNumber: '3', totalCredit: '', semesterGpa: '' },
    ];
  });

  const [result, setResult] = React.useState(null);
  const [errors, setErrors] = React.useState([]);
  const [isOutdated, setIsOutdated] = React.useState(false);

  // Save to localStorage when changed
  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(semesters));
    } catch {
      // Ignore
    }
  }, [semesters]);

  // Find next unused positive whole number
  const getNextSemesterNumber = (currentList) => {
    const usedNumbers = new Set(
      currentList
        .map(s => parseInt(String(s.semesterNumber).trim(), 10))
        .filter(n => !isNaN(n) && n > 0)
    );
    let next = 1;
    while (usedNumbers.has(next)) {
      next++;
    }
    return String(next);
  };

  // Handle inputs
  const handleInputChange = (id, field, value) => {
    setSemesters(prev =>
      prev.map(sem =>
        sem.id === id ? { ...sem, [field]: value } : sem
      )
    );
    if (result) {
      setIsOutdated(true);
    }
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  // Add semester row
  const handleAddSemester = () => {
    const nextNum = getNextSemesterNumber(semesters);
    const newId = `sem-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setSemesters(prev => [
      ...prev,
      { id: newId, semesterNumber: nextNum, totalCredit: '', semesterGpa: '' },
    ]);
    if (result) {
      setIsOutdated(true);
    }
  };

  // Remove semester row
  const handleRemoveSemester = (id) => {
    setSemesters(prev => prev.filter(sem => sem.id !== id));
    if (result) {
      setIsOutdated(true);
    }
  };

  // Clear all semesters and result
  const handleClearAll = () => {
    const empty = [
      { id: `sem-${Date.now()}-1`, semesterNumber: '1', totalCredit: '', semesterGpa: '' },
      { id: `sem-${Date.now()}-2`, semesterNumber: '2', totalCredit: '', semesterGpa: '' },
      { id: `sem-${Date.now()}-3`, semesterNumber: '3', totalCredit: '', semesterGpa: '' },
    ];
    setSemesters(empty);
    setResult(null);
    setErrors([]);
    setIsOutdated(false);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  // Calculate Overall CGPA
  const handleCalculate = () => {
    const calcResult = calculateOverallCGPA(semesters);
    if (!calcResult.isValid) {
      setErrors(calcResult.errors);
      setResult(null);
      setIsOutdated(false);
    } else {
      setErrors([]);
      setResult(calcResult);
      setIsOutdated(false);
    }
  };

  return (
    <div className="space-y-12">
      {/* Page Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3 pt-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Cumulative Academic Performance</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Overall CGPA Calculator
        </h2>
        <p className="text-sm sm:text-base text-slate-400">
          Enter your semester numbers, total credits, and achieved semester GPAs to compute your official credit-weighted Overall CGPA.
        </p>
      </div>

      {/* Main Input Card */}
      <section className="bg-[#0D1422] rounded-2xl border border-[#1E293B] p-6 lg:p-8 shadow-2xl relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#1E293B]">
          <div>
            <h3 className="text-lg font-bold text-white m-0">Semester Information Table</h3>
            <p className="text-xs text-slate-400 mt-0.5 m-0">
              Enter Semester Number (positive integer), Total Credit, and Semester GPA (0.00 – 4.00).
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleClearAll}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/20 hover:bg-rose-500/20 hover:text-rose-200 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          </div>
        </div>

        {/* Semester Input Table */}
        <div className="overflow-x-auto rounded-xl border border-[#1E293B]">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-[#111B2C] text-xs uppercase tracking-wider text-slate-400 border-b border-[#1E293B]">
              <tr>
                <th scope="col" className="px-4 py-3.5 font-semibold">Semester Number</th>
                <th scope="col" className="px-4 py-3.5 font-semibold">Total Credit</th>
                <th scope="col" className="px-4 py-3.5 font-semibold">Semester GPA</th>
                <th scope="col" className="px-4 py-3.5 font-semibold text-center w-20">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]">
              {semesters.map((sem, index) => (
                <tr key={sem.id} className="hover:bg-[#111B2C]/40 transition-colors">
                  {/* Semester Number input */}
                  <td className="px-4 py-3">
                    <label htmlFor={`semNum-${sem.id}`} className="sr-only">
                      Semester Number for row {index + 1}
                    </label>
                    <input
                      id={`semNum-${sem.id}`}
                      type="number"
                      min="1"
                      step="1"
                      placeholder="e.g. 1"
                      value={sem.semesterNumber}
                      onChange={(e) => handleInputChange(sem.id, 'semesterNumber', e.target.value)}
                      className="w-full sm:max-w-xs px-3.5 py-2 rounded-lg bg-[#070B14] border border-[#1E293B] text-white placeholder-slate-500 font-mono text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    />
                  </td>

                  {/* Total Credit input */}
                  <td className="px-4 py-3">
                    <label htmlFor={`credit-${sem.id}`} className="sr-only">
                      Total Credit for row {index + 1}
                    </label>
                    <input
                      id={`credit-${sem.id}`}
                      type="number"
                      step="1"
                      min="1"
                      placeholder="e.g. 15"
                      value={sem.totalCredit}
                      onChange={(e) => handleInputChange(sem.id, 'totalCredit', e.target.value)}
                      className="w-full sm:max-w-xs px-3.5 py-2 rounded-lg bg-[#070B14] border border-[#1E293B] text-white placeholder-slate-500 font-mono text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    />
                  </td>

                  {/* Semester GPA input */}
                  <td className="px-4 py-3">
                    <label htmlFor={`gpa-${sem.id}`} className="sr-only">
                      Semester GPA for row {index + 1}
                    </label>
                    <input
                      id={`gpa-${sem.id}`}
                      type="number"
                      step="any"
                      min="0.00"
                      max="4.00"
                      inputMode="decimal"
                      placeholder="e.g. 3.75"
                      value={sem.semesterGpa}
                      onChange={(e) => handleInputChange(sem.id, 'semesterGpa', e.target.value)}
                      className="w-full sm:max-w-xs px-3.5 py-2 rounded-lg bg-[#070B14] border border-[#1E293B] text-white placeholder-slate-500 font-mono text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors no-spinner"
                    />
                  </td>

                  {/* Action (Delete button) */}
                  <td className="px-4 py-3 text-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveSemester(sem.id)}
                      disabled={semesters.length <= 1}
                      title={`Delete semester row ${index + 1}`}
                      aria-label={`Delete semester row ${index + 1}`}
                      className={`p-2 rounded-lg transition-colors cursor-pointer ${
                        semesters.length <= 1
                          ? 'text-slate-600 cursor-not-allowed opacity-40'
                          : 'text-slate-400 hover:text-rose-400 hover:bg-rose-500/10'
                      }`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t border-[#1E293B] bg-[#111B2C]/20">
              <tr>
                <td className="px-4 py-3.5">
                  <button
                    type="button"
                    onClick={handleAddSemester}
                    className="flex items-center justify-center gap-1.5 w-full sm:max-w-xs px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold bg-blue-600/20 text-blue-300 border border-blue-500/30 hover:bg-blue-600/30 hover:text-white transition-all cursor-pointer shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Semester</span>
                  </button>
                </td>
                <td className="px-4 py-3.5"></td>
                <td className="px-4 py-3.5"></td>
                <td className="px-4 py-3.5 text-center"></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Validation Errors Box */}
        {errors.length > 0 && (
          <div className="mt-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 space-y-1">
            <div className="flex items-center gap-2 font-semibold text-sm">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>Please review the following input errors:</span>
            </div>
            <ul className="list-disc list-inside text-xs space-y-0.5 pl-6 text-rose-200">
              {errors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Prominent Gradient "See Result" Button */}
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={handleCalculate}
            className="flex items-center gap-2.5 px-8 py-3.5 rounded-xl font-bold text-white text-base bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 shadow-xl shadow-blue-600/25 hover:shadow-blue-600/40 transform hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
          >
            <span>See Result</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Result Section (Hidden until valid calculation) */}
      {result && (
        <OverallCgpaResult result={result} isOutdated={isOutdated} />
      )}

      {/* Official Grading Scale Table */}
      <GradingScaleSection />

      {/* How It Works Section */}
      <HowItWorksSection type="overall" />

      {/* Helpful Tips Section */}
      <HelpfulTipsSection type="overall" />
    </div>
  );
}
