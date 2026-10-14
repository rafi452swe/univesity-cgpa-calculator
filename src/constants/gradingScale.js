/*
 * Authoritative University Grading Scale (4.00 max scale)
 * Single source of truth for both calculator pages, dropdowns, and grading tables.
 */
export const GRADING_SCALE = [
  { marksRange: '80.00–100.00', letterGrade: 'A+', gradePoint: 4.00, performance: 'Outstanding / Excellent' },
  { marksRange: '75.00–79.99', letterGrade: 'A', gradePoint: 3.75, performance: 'Excellent' },
  { marksRange: '70.00–74.99', letterGrade: 'A-', gradePoint: 3.50, performance: 'Very Good' },
  { marksRange: '65.00–69.99', letterGrade: 'B+', gradePoint: 3.25, performance: 'Good' },
  { marksRange: '60.00–64.99', letterGrade: 'B', gradePoint: 3.00, performance: 'Satisfactory' },
  { marksRange: '55.00–59.99', letterGrade: 'B-', gradePoint: 2.75, performance: 'Above Average' },
  { marksRange: '50.00–54.99', letterGrade: 'C+', gradePoint: 2.50, performance: 'Average' },
  { marksRange: '45.00–49.99', letterGrade: 'C', gradePoint: 2.25, performance: 'Below Average' },
  { marksRange: '40.00–44.99', letterGrade: 'D', gradePoint: 2.00, performance: 'Pass' },
  { marksRange: 'Below 40.00', letterGrade: 'F', gradePoint: 0.00, performance: 'Fail' },
];

/**
 * Dropdown options derived directly from the single source of truth.
 * Format: "A+ — 4.00"
 */
export const GRADE_DROPDOWN_OPTIONS = GRADING_SCALE.map(item => ({
  value: item.gradePoint.toFixed(2),
  numericValue: item.gradePoint,
  letterGrade: item.letterGrade,
  label: `${item.letterGrade} — ${item.gradePoint.toFixed(2)}`,
}));

/**
 * Look up letter grade from numeric grade point
 */
export function getGradeInfoByPoint(gradePoint) {
  const numeric = typeof gradePoint === 'number' ? gradePoint : parseFloat(gradePoint);
  return GRADING_SCALE.find(item => Math.abs(item.gradePoint - numeric) < 0.001) || null;
}
