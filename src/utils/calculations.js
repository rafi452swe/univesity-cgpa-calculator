/**
 * Calculation Logic for Semester GPA and Overall CGPA
 * Kept strictly isolated from UI components.
 */

/**
 * Validates a course row
 * @param {Object} course - { id, creditHour, gradePoint }
 * @returns {string|null} error message or null if valid
 */
export function validateCourseRow(course, index) {
  const rowNum = index + 1;
  const creditStr = String(course.creditHour ?? '').trim();
  const gpStr = String(course.gradePoint ?? '').trim();

  if (creditStr === '' && gpStr === '') {
    return `Row ${rowNum}: Credit Hour and Grade Point are required.`;
  }

  if (creditStr === '') {
    return `Row ${rowNum}: Credit Hour is required.`;
  }

  const credit = Number(creditStr);
  if (isNaN(credit) || !isFinite(credit) || !Number.isInteger(credit) || credit <= 0) {
    return `Row ${rowNum}: Credit Hour must be a positive whole number (e.g., 1, 2, 3, 4).`;
  }

  if (gpStr === '') {
    return `Row ${rowNum}: Please select a Grade Point.`;
  }

  const gp = Number(gpStr);
  if (isNaN(gp) || !isFinite(gp)) {
    return `Row ${rowNum}: Selected Grade Point is invalid.`;
  }

  if (gp < 0 || gp > 4.0) {
    return `Row ${rowNum}: Grade Point must be between 0.00 and 4.00.`;
  }

  return null;
}

/**
 * Calculate Semester GPA
 * Formula: Semester GPA = Σ(Credit Hour × Grade Point) / Σ(Credit Hour)
 *
 * @param {Array} courses - array of { creditHour, gradePoint }
 * @returns {Object} { isValid, errors, gpa, totalCredits, totalCourses, distribution }
 */
export function calculateSemesterGPA(courses) {
  if (!Array.isArray(courses) || courses.length === 0) {
    return {
      isValid: false,
      errors: ['Please add at least one course before calculating.'],
      gpa: 0,
      totalCredits: 0,
      totalCourses: 0,
      distribution: [],
    };
  }

  const errors = [];
  courses.forEach((course, index) => {
    const error = validateCourseRow(course, index);
    if (error) errors.push(error);
  });

  if (errors.length > 0) {
    return {
      isValid: false,
      errors,
      gpa: 0,
      totalCredits: 0,
      totalCourses: 0,
      distribution: [],
    };
  }

  let totalWeighted = 0;
  let totalCredits = 0;
  const gradeCountMap = new Map();

  for (const course of courses) {
    const credit = Number(course.creditHour);
    const gp = Number(course.gradePoint);

    totalWeighted += credit * gp;
    totalCredits += credit;

    // Track grade distribution by numeric grade point
    const gpKey = gp.toFixed(2);
    gradeCountMap.set(gpKey, (gradeCountMap.get(gpKey) || 0) + 1);
  }

  if (totalCredits <= 0) {
    return {
      isValid: false,
      errors: ['Total credits must be greater than zero.'],
      gpa: 0,
      totalCredits: 0,
      totalCourses: courses.length,
      distribution: [],
    };
  }

  const fullPrecisionGPA = totalWeighted / totalCredits;
  const roundedGPA = Number(fullPrecisionGPA.toFixed(2));

  // Prepare distribution sorted descending by numeric grade point
  const distribution = Array.from(gradeCountMap.entries())
    .map(([gradePointStr, count]) => {
      const numericGP = parseFloat(gradePointStr);
      return {
        gradePoint: numericGP,
        gradePointFormatted: gradePointStr,
        count,
      };
    })
    .sort((a, b) => b.gradePoint - a.gradePoint);

  return {
    isValid: true,
    errors: [],
    gpa: roundedGPA,
    rawGpa: fullPrecisionGPA,
    totalCredits: Math.round(totalCredits * 100) / 100,
    totalCourses: courses.length,
    distribution,
  };
}

/**
 * Validates a semester row
 * @param {Object} semester - { id, semesterNumber, totalCredit, semesterGpa }
 * @param {number} index
 * @param {Set} seenSemesterNumbers
 * @returns {string|null} error message or null if valid
 */
export function validateSemesterRow(semester, index, seenSemesterNumbers) {
  const rowNum = index + 1;
  const semNumStr = String(semester.semesterNumber ?? '').trim();
  const creditStr = String(semester.totalCredit ?? '').trim();
  const gpaStr = String(semester.semesterGpa ?? '').trim();

  if (semNumStr === '' && creditStr === '' && gpaStr === '') {
    return `Row ${rowNum}: Semester Number, Total Credit, and Semester GPA are required.`;
  }

  // 1. Validate Semester Number
  if (semNumStr === '') {
    return `Row ${rowNum}: Semester Number is required.`;
  }

  const semNum = Number(semNumStr);
  if (!Number.isInteger(semNum) || semNum <= 0) {
    return `Row ${rowNum}: Semester Number must be a positive whole number (e.g., 1, 2, 3).`;
  }

  if (seenSemesterNumbers.has(semNum)) {
    return `Row ${rowNum}: Duplicate Semester Number "${semNum}". Each semester number must be unique.`;
  }
  seenSemesterNumbers.add(semNum);

  // 2. Validate Total Credit
  if (creditStr === '') {
    return `Row ${rowNum}: Total Credit is required.`;
  }

  const credit = Number(creditStr);
  if (isNaN(credit) || !isFinite(credit) || !Number.isInteger(credit) || credit <= 0) {
    return `Row ${rowNum}: Total Credit must be a positive whole number (e.g., 1, 2, 3, 4).`;
  }

  // 3. Validate Semester GPA
  if (gpaStr === '') {
    return `Row ${rowNum}: Semester GPA is required.`;
  }

  const gpa = Number(gpaStr);
  if (isNaN(gpa) || !isFinite(gpa)) {
    return `Row ${rowNum}: Semester GPA must be a valid number.`;
  }

  if (gpa < 0 || gpa > 4.0) {
    return `Row ${rowNum}: Semester GPA must be between 0.00 and 4.00.`;
  }

  return null;
}

/**
 * Calculate Overall CGPA
 * Formula: Overall CGPA = Σ(Total Credit × Semester GPA) / Σ(Total Credit)
 *
 * @param {Array} semesters - array of { semesterNumber, totalCredit, semesterGpa }
 * @returns {Object} { isValid, errors, cgpa, totalCredits, totalSemesters, breakdown }
 */
export function calculateOverallCGPA(semesters) {
  if (!Array.isArray(semesters) || semesters.length === 0) {
    return {
      isValid: false,
      errors: ['Please add at least one semester before calculating.'],
      cgpa: 0,
      totalCredits: 0,
      totalSemesters: 0,
      breakdown: [],
    };
  }

  const errors = [];
  const seenSemesterNumbers = new Set();

  semesters.forEach((sem, index) => {
    const error = validateSemesterRow(sem, index, seenSemesterNumbers);
    if (error) errors.push(error);
  });

  if (errors.length > 0) {
    return {
      isValid: false,
      errors,
      cgpa: 0,
      totalCredits: 0,
      totalSemesters: 0,
      breakdown: [],
    };
  }

  let totalWeighted = 0;
  let totalCredits = 0;

  for (const sem of semesters) {
    const credit = Number(sem.totalCredit);
    const gpa = Number(sem.semesterGpa);

    totalWeighted += credit * gpa;
    totalCredits += credit;
  }

  if (totalCredits <= 0) {
    return {
      isValid: false,
      errors: ['Total credits must be greater than zero.'],
      cgpa: 0,
      totalCredits: 0,
      totalSemesters: semesters.length,
      breakdown: [],
    };
  }

  const fullPrecisionCGPA = totalWeighted / totalCredits;
  const roundedCGPA = Number(fullPrecisionCGPA.toFixed(2));

  // Sort breakdown in ascending order of semester number
  const breakdown = [...semesters]
    .map(sem => ({
      semesterNumber: Number(sem.semesterNumber),
      semesterLabel: `Semester ${sem.semesterNumber}`,
      credit: Number(sem.totalCredit),
      gpa: Number(Number(sem.semesterGpa).toFixed(2)),
    }))
    .sort((a, b) => a.semesterNumber - b.semesterNumber);

  return {
    isValid: true,
    errors: [],
    cgpa: roundedCGPA,
    rawCgpa: fullPrecisionCGPA,
    totalCredits: Math.round(totalCredits * 100) / 100,
    totalSemesters: semesters.length,
    breakdown,
  };
}
