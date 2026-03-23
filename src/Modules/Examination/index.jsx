import { Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import ExamShell from "./components/ExamShell";
import RoleGuard from "./components/RoleGuard";
import SubmitGrades from "./submitGrades";
import ValidateGrades from "./ValidateGrades";
import VerifyGrades from "./verifyGrades";
import CheckResult from "./checkResult";
import Transcript from "./Transcript";
import Announcement from "./announcement";
import SeatingPlan from "./seatingPlan";
import { examinationRoutes } from "../../routes/examinationRoutes";
import { normalizeRole } from "./components/roleUtils";

function getDefaultRoute(role) {
  const normalizedRole = normalizeRole(role);
  if (normalizedRole === "superuser") {
    return examinationRoutes.announcements;
  }
  if (normalizedRole === "faculty") {
    return examinationRoutes.submitGrades;
  }
  if (normalizedRole === "dean") {
    return examinationRoutes.validateGrades;
  }
  if (normalizedRole === "acadadmin") {
    return examinationRoutes.announcements;
  }
  if (normalizedRole === "student") {
    return examinationRoutes.results;
  }
  return examinationRoutes.submitGrades;
}

export default function ExaminationModule() {
  const role = normalizeRole(useSelector((state) => state.user.role));

  return (
    <ExamShell>
      <Routes>
        <Route
          path="/"
          element={<Navigate to={getDefaultRoute(role)} replace />}
        />
        <Route
          path="submit-grades"
          element={
            <RoleGuard
              roles={["faculty"]}
            >
              <SubmitGrades />
            </RoleGuard>
          }
        />
        <Route
          path="validate-grades"
          element={
            <RoleGuard roles={["dean", "superuser"]}>
              <ValidateGrades />
            </RoleGuard>
          }
        />
        <Route
          path="verify-grades"
          element={
            <RoleGuard roles={["dean", "superuser"]}>
              <VerifyGrades />
            </RoleGuard>
          }
        />
        <Route
          path="results"
          element={
            <RoleGuard roles={["student"]}>
              <CheckResult />
            </RoleGuard>
          }
        />
        <Route
          path="transcript"
          element={
            <RoleGuard roles={["student", "acadadmin"]}>
              <Transcript />
            </RoleGuard>
          }
        />
        <Route
          path="announcements"
          element={
            <RoleGuard roles={["acadadmin", "superuser"]}>
              <Announcement />
            </RoleGuard>
          }
        />
        <Route
          path="seating-plan"
          element={
            <RoleGuard roles={["acadadmin", "superuser"]}>
              <SeatingPlan />
            </RoleGuard>
          }
        />
      </Routes>
    </ExamShell>
  );
}
