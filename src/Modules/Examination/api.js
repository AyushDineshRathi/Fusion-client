import axios from "axios";
import { examinationApiRoutes } from "../../routes/examinationRoutes";
import { academicProceduresFaculty } from "../../routes/academicRoutes";

const examApi = axios.create();

examApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

export const fetchDashboard = async () => {
  const { data } = await examApi.get(examinationApiRoutes.dashboard);
  return data;
};

export const fetchFacultyAssignedCourses = async () => {
  const { data } = await examApi.get(academicProceduresFaculty);
  return data?.assigned_courses || [];
};

export const fetchAcadAdminOptions = async () => {
  const { data } = await examApi.get(examinationApiRoutes.acadAdminOptions);
  return data;
};

export const fetchCourseSummary = async ({
  courseId,
  semesterId,
  academicYear,
}) => {
  const { data } = await examApi.get(examinationApiRoutes.courseSummary, {
    params: {
      course_id: courseId,
      semester_id: semesterId,
      academic_year: academicYear,
    },
  });
  return data;
};

export const submitGrades = async (payload) => {
  const { data } = await examApi.post(
    examinationApiRoutes.submitGrades,
    payload,
  );
  return data;
};

export const previewGradesCsv = async ({ file }) => {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await examApi.post(
    examinationApiRoutes.previewCsv,
    formData,
  );
  return data;
};

export const uploadGradesCsv = async ({
  courseId,
  semesterId,
  academicYear,
  file,
}) => {
  const formData = new FormData();
  formData.append("course_id", courseId);
  formData.append("semester_id", semesterId);
  formData.append("academic_year", academicYear);
  formData.append("file", file);
  const { data } = await examApi.post(examinationApiRoutes.uploadCsv, formData);
  return data;
};

export const downloadGradeTemplate = async () => {
  const { data } = await examApi.get(examinationApiRoutes.downloadTemplate, {
    responseType: "blob",
  });
  return data;
};

export const verifyGrades = async (payload) => {
  const { data } = await examApi.post(
    examinationApiRoutes.verifyGrades,
    payload,
  );
  return data;
};

export const updateGrade = async (payload) => {
  const { data } = await examApi.post(
    examinationApiRoutes.updateGrade,
    payload,
  );
  return data;
};

export const validateGrades = async ({
  courseId,
  semesterId,
  academicYear,
}) => {
  const { data } = await examApi.get(examinationApiRoutes.validateGrades, {
    params: {
      course_id: courseId,
      semester_id: semesterId,
      academic_year: academicYear,
    },
  });
  return data;
};

export const publishResults = async (payload) => {
  const { data } = await examApi.post(
    examinationApiRoutes.publishResults,
    payload,
  );
  return data;
};

export const fetchAnnouncements = async () => {
  const { data } = await examApi.get(examinationApiRoutes.announcements);
  return data;
};

export const createAnnouncement = async (payload) => {
  const { data } = await examApi.post(
    examinationApiRoutes.announcements,
    payload,
  );
  return data;
};

export const fetchStudentSemesters = async () => {
  const { data } = await examApi.get(examinationApiRoutes.studentSemesters);
  return data;
};

export const fetchStudentResults = async ({ semesterId, academicYear }) => {
  const { data } = await examApi.get(examinationApiRoutes.studentResults, {
    params: { semester_id: semesterId, academic_year: academicYear },
  });
  return data;
};

export const fetchTranscript = async ({ studentId, format }) => {
  const { data } = await examApi.get(examinationApiRoutes.transcript, {
    params: { student_id: studentId, format },
    responseType: format === "pdf" ? "blob" : "json",
  });
  return data;
};

export const fetchStudentTranscript = async ({ format }) => {
  const { data } = await examApi.get(examinationApiRoutes.studentTranscript, {
    params: { format },
    responseType: format === "pdf" ? "blob" : "json",
  });
  return data;
};

export const fetchMarksheet = async ({
  semesterId,
  academicYear,
  semesterNo,
}) => {
  const { data } = await examApi.get(examinationApiRoutes.marksheet, {
    params: {
      semester_id: semesterId,
      academic_year: academicYear,
      semester_no: semesterNo,
    },
    responseType: "blob",
  });
  return data;
};

export const requestReevaluation = async (payload) => {
  const { data } = await examApi.post(
    examinationApiRoutes.reevaluation,
    payload,
  );
  return data;
};

export const fetchReevaluationRequests = async () => {
  const { data } = await examApi.get(examinationApiRoutes.reevaluation);
  return data;
};

export const resolveReevaluation = async (payload) => {
  const { data } = await examApi.post(
    examinationApiRoutes.resolveReevaluation,
    payload,
  );
  return data;
};

export const fetchAuditLogs = async ({ courseId, studentId }) => {
  const { data } = await examApi.get(examinationApiRoutes.auditLogs, {
    params: { course_id: courseId, student_id: studentId },
  });
  return data;
};

export const fetchSeatingPlans = async ({ academicYear }) => {
  const { data } = await examApi.get(examinationApiRoutes.seatingPlan, {
    params: { academic_year: academicYear },
  });
  return data;
};

export const generateSeatingPlan = async (payload) => {
  const { data } = await examApi.post(
    examinationApiRoutes.seatingPlan,
    payload,
  );
  return data;
};

export const sendReminders = async (payload) => {
  const { data } = await examApi.post(examinationApiRoutes.reminders, payload);
  return data;
};

export const exportBatchResultExcel = async ({
  batchId,
  semesterId,
  academicYear,
}) => {
  const { data } = await examApi.get(examinationApiRoutes.resultExcel, {
    params: {
      batch_id: batchId,
      semester_id: semesterId,
      academic_year: academicYear,
    },
    responseType: "blob",
  });
  return data;
};
