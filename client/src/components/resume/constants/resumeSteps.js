export const RESUME_STEPS = [
  { step: 1, title: "Personal Information", subtitle: "Your basic contact details." },
  { step: 2, title: "Professional Summary", subtitle: "Your quick introduction and career goals." },
  { step: 3, title: "Skills", subtitle: "Your technical and core competencies." },
  { step: 4, title: "Work Experience", subtitle: "Your past jobs and internships." },
  { step: 5, title: "Projects", subtitle: "Projects you've built and deployed." },
  { step: 6, title: "Education", subtitle: "Your academic background." },
  { step: 7, title: "Additional Information", subtitle: "Certifications, awards, or languages." },
];

export const TOTAL_STEPS = RESUME_STEPS.length;

// O(1) step lookup map
export const STEP_MAP = Object.freeze(
  RESUME_STEPS.reduce((acc, curr) => {
    acc[curr.step] = curr;
    return acc;
  }, {})
);