import React from 'react';
import { Plus, Trash2, RotateCcw, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { GRADE_DROPDOWN_OPTIONS } from '../constants/gradingScale';
import SemesterGpaResult from '../components/SemesterGpaResult';
import GradingScaleSection from '../components/GradingScaleSection';
import { HowItWorksSection, HelpfulTipsSection } from '../components/HowItWorksAndTips';
import { calculateSemesterGPA } from '../utils/calculations';

const STORAGE_KEY = 'uni_cgpa_calc_semester_courses_v1';

export default function SemesterGpaPage() {
  // Initial course row state
  const [courses, setCourses] = React.useState(() => {
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
      { id: 'course-1', creditHour: '', gradePoint: '' },
      { id: 'course-2', creditHour: '', gradePoint: '' },
      { id: 'course-3', creditHour: '', gradePoint: '' },
    ];
  });

  const [result, setResult] = React.useState(null);
  const [errors, setErrors] = React.useState([]);
  const [isOutdated, setIsOutdated] = React.useState(false);

  // Save courses to localStorage when changed
  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
    } catch {
      // Ignore storage errors
    }
  }, [courses]);

  // Handle course input changes
  const handleInputChange = (id, field, value) => {
    setCourses(prev =>
      prev.map(course =>
        course.id === id ? { ...course, [field]: value } : course
      )
    );
    // If a calculation was already made, mark it as outdated
    if (result) {
      setIsOutdated(true);
    }
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  // Add course row
  const handleAddCourse = () => {
    const newId = `course-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setCourses(prev => [...prev, { id: newId, creditHour: '', gradePoint: '' }]);
    if (result) {
      setIsOutdated(true);
    }
  };

  // Remove course row
  const handleRemoveCourse = (id) => {
    setCourses(prev => {
      const updated = prev.filter(course => course.id !== id);
      return updated;
    });
    if (result) {
      setIsOutdated(true);
    }
  };

  // Clear all courses and result
  const handleClearAll = () => {
    const emptyCourses = [
      { id: `course-${Date.now()}-1`, creditHour: '', gradePoint: '' },
      { id: `course-${Date.now()}-2`, creditHour: '', gradePoint: '' },
      { id: `course-${Date.now()}-3`, creditHour: '', gradePoint: '' },
    ];
    setCourses(emptyCourses);
    setResult(null);
    setErrors([]);
    setIsOutdated(false);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  // Handle See Result click
  const handleCalculate = () => {
    const calcResult = calculateSemesterGPA(courses);
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
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Semester-Level Academic Performance</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Semester GPA Calculator
        </h2>
        <p className="text-sm sm:text-base text-slate-400">
          Enter your course credit hours and select your grade points to calculate your precise credit-weighted Semester GPA.
        </p>
      </div>

      {/* Main Input Card */}
      <section className="bg-[#0D1422] rounded-2xl border border-[#1E293B] p-6 lg:p-8 shadow-2xl relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#1E293B]">
          <div>
            <h3 className="text-lg font-bold text-white m-0">Course Information Table</h3>
            <p className="text-xs text-slate-400 mt-0.5 m-0">
              Only numeric Credit Hour and Grade Point are required.
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

        {/* Input Table */}
        <div className="overflow-x-auto rounded-xl border border-[#1E293B]">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-[#111B2C] text-xs uppercase tracking-wider text-slate-400 border-b border-[#1E293B]">
              <tr>
                <th scope="col" className="px-4 py-3.5 font-semibold">Credit Hour</th>
                <th scope="col" className="px-4 py-3.5 font-semibold">Grade Point</th>
                <th scope="col" className="px-4 py-3.5 font-semibold text-center w-20">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]">
              {courses.map((course, index) => (
                <tr key={course.id} className="hover:bg-[#111B2C]/40 transition-colors">
                  {/* Credit Hour Input */}
                  <td className="px-4 py-3">
                    <label htmlFor={`credit-${course.id}`} className="sr-only">
                      Credit Hour for row {index + 1}
                    </label>
                    <input
                      id={`credit-${course.id}`}
                      type="number"
                      step="1"
                      min="1"
                      placeholder="e.g. 3"
                      value={course.creditHour}
                      onChange={(e) => handleInputChange(course.id, 'creditHour', e.target.value)}
                      className="w-full sm:max-w-xs px-3.5 py-2 rounded-lg bg-[#070B14] border border-[#1E293B] text-white placeholder-slate-500 font-mono text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                    />
                  </td>

                  {/* Grade Point Dropdown */}
                  <td className="px-4 py-3">
                    <label htmlFor={`grade-${course.id}`} className="sr-only">
                      Grade Point for row {index + 1}
                    </label>
                    <select
                      id={`grade-${course.id}`}
                      value={course.gradePoint}
                      onChange={(e) => handleInputChange(course.id, 'gradePoint', e.target.value)}
                      className="w-full sm:max-w-xs px-3.5 py-2 rounded-lg bg-[#070B14] border border-[#1E293B] text-white font-mono text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors cursor-pointer"
                    >
                      <option value="" disabled className="text-slate-500 bg-[#0D1422]">
                        Select Grade Point
                      </option>
                      {GRADE_DROPDOWN_OPTIONS.map(opt => (
                        <option 
                          key={opt.value} 
                          value={opt.value} 
                          className="bg-[#0D1422] text-white"
                        >
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Action (Delete button) */}
                  <td className="px-4 py-3 text-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveCourse(course.id)}
                      disabled={courses.length <= 1}
                      title={`Delete course row ${index + 1}`}
                      aria-label={`Delete course row ${index + 1}`}
                      className={`p-2 rounded-lg transition-colors cursor-pointer ${
                        courses.length <= 1
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
                    onClick={handleAddCourse}
                    className="flex items-center justify-center gap-1.5 w-full sm:max-w-xs px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold bg-purple-600/20 text-purple-300 border border-purple-500/30 hover:bg-purple-600/30 hover:text-white transition-all cursor-pointer shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Course</span>
                  </button>
                </td>
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
            className="flex items-center gap-2.5 px-8 py-3.5 rounded-xl font-bold text-white text-base bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-500 hover:via-blue-500 hover:to-indigo-500 shadow-xl shadow-purple-600/25 hover:shadow-purple-600/40 transform hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
          >
            <span>See Result</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Result Section (Hidden until valid calculation) */}
      {result && (
        <SemesterGpaResult result={result} isOutdated={isOutdated} />
      )}

      {/* Official Grading Scale Table */}
      <GradingScaleSection />

      {/* How It Works Section */}
      <HowItWorksSection type="semester" />

      {/* Helpful Tips Section */}
      <HelpfulTipsSection type="semester" />
    </div>
  );
}
