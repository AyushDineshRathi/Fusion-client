import { host } from "../globalRoutes";

export const examinationRoutes = {
  root: "/examination",
  submitGrades: "/examination/submit-grades",
  validateGrades: "/examination/validate-grades",
  verifyGrades: "/examination/verify-grades",
  results: "/examination/results",
  transcript: "/examination/transcript",
  announcements: "/examination/announcements",
  seatingPlan: "/examination/seating-plan",
};

export const examinationNavItems = [
  {
    label: "Submit Grades",
    path: examinationRoutes.submitGrades,
    roles: ["faculty"],
  },
  {
    label: "Validate Grades",
    path: examinationRoutes.validateGrades,
    roles: ["dean", "superuser"],
  },
  {
    label: "Verify Grades",
    path: examinationRoutes.verifyGrades,
    roles: ["dean", "superuser"],
  },
  {
    label: "Results",
    path: examinationRoutes.results,
    roles: ["student"],
  },
  {
    label: "Transcript",
    path: examinationRoutes.transcript,
    roles: ["student", "acadadmin"],
  },
  {
    label: "Announcements",
    path: examinationRoutes.announcements,
    roles: ["acadadmin", "superuser"],
  },
  {
    label: "Seating Plan",
    path: examinationRoutes.seatingPlan,
    roles: ["acadadmin", "superuser"],
  },
];

export const examinationApiRoutes = {
  dashboard: `${host}/examination/api/dashboard/`,
  submitGrades: `${host}/examination/api/faculty/submit-grades/`,
  previewCsv: `${host}/examination/api/faculty/preview-csv/`,
  uploadCsv: `${host}/examination/api/faculty/upload-csv/`,
  downloadTemplate: `${host}/examination/api/faculty/download-template/`,
  courseSummary: `${host}/examination/api/faculty/course-summary/`,
  validateGrades: `${host}/examination/api/dean/validate-grades/`,
  verifyGrades: `${host}/examination/api/dean/verify-grades/`,
  publishResults: `${host}/examination/api/acad-admin/publish-results/`,
  announcements: `${host}/examination/api/acad-admin/announcements/`,
  studentSemesters: `${host}/examination/api/student/results/semesters/`,
  studentResults: `${host}/examination/api/student/results/`,
  marksheet: `${host}/examination/api/student/marksheet/`,
  transcript: `${host}/examination/api/acad-admin/transcript/`,
  studentTranscript: `${host}/examination/api/student/transcript/`,
  reevaluation: `${host}/examination/api/student/reevaluation/`,
  resolveReevaluation: `${host}/examination/api/dean/reevaluation/resolve/`,
  auditLogs: `${host}/examination/api/audit-logs/`,
  seatingPlan: `${host}/examination/api/acad-admin/seating-plan/`,
  reminders: `${host}/examination/api/acad-admin/reminders/`,
  acadAdminOptions: `${host}/examination/api/acad-admin/options/`,
  updateGrade: `${host}/examination/api/dean/update-grade/`,
  resultExcel: `${host}/examination/api/acad-admin/generate-result-excel/`,
};
