import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Alert,
  Button,
  Card,
  Group,
  Progress,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useForm } from "@mantine/form";
import {
  downloadGradeTemplate,
  fetchAuditLogs,
  fetchFacultyAssignedCourses,
  fetchCourseSummary,
  fetchDashboard,
  previewGradesCsv,
  submitGrades,
  uploadGradesCsv,
} from "./api";
import GradeTable from "./components/GradeTable";
import GradeUploadForm from "./components/GradeUploadForm";

export default function SubmitGrades() {
  const getErrorMessage = (error, fallback) => {
    const payload = error?.response?.data;
    if (!payload) {
      return fallback;
    }
    if (typeof payload.detail === "string" && payload.detail) {
      return payload.detail;
    }
    if (typeof payload.error === "string" && payload.error) {
      return payload.error;
    }
    if (typeof payload === "string") {
      return payload;
    }
    const firstKey = Object.keys(payload || {})[0];
    const firstValue = firstKey ? payload[firstKey] : "";
    if (Array.isArray(firstValue) && firstValue.length > 0) {
      return `${firstKey}: ${firstValue[0]}`;
    }
    if (typeof firstValue === "string" && firstValue) {
      return `${firstKey}: ${firstValue}`;
    }
    return fallback;
  };

  const downloadBlob = (blob, fileName) => {
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = fileName;
    anchor.click();
    window.URL.revokeObjectURL(url);
  };

  const manualForm = useForm({
    initialValues: {
      course_id: "",
      semester_id: "",
      academic_year: "",
      student_id: "",
      letter_grade: "",
      internal_marks: "",
      internal_max_marks: "",
      external_marks: "",
      external_max_marks: "",
      reason: "",
    },
    validate: {
      course_id: (value) => (value ? null : "Course is required."),
      semester_id: (value) => (value ? null : "Semester ID is required."),
      academic_year: (value) => (value ? null : "Academic year is required."),
      student_id: (value) =>
        value ? null : "Student roll number is required.",
      internal_marks: (value, values) =>
        value &&
        values.internal_max_marks &&
        Number(value) > Number(values.internal_max_marks)
          ? "Internal marks cannot exceed internal max."
          : null,
      external_marks: (value, values) =>
        value &&
        values.external_max_marks &&
        Number(value) > Number(values.external_max_marks)
          ? "External marks cannot exceed external max."
          : null,
    },
  });

  const analysisFilters = {
    courseId: manualForm.values.course_id,
    semesterId: manualForm.values.semester_id,
    academicYear: manualForm.values.academic_year,
  };

  const dashboardQuery = useQuery({
    queryKey: ["exam-dashboard"],
    queryFn: fetchDashboard,
  });
  const facultyCoursesQuery = useQuery({
    queryKey: ["faculty-assigned-courses"],
    queryFn: fetchFacultyAssignedCourses,
  });
  const previewMutation = useMutation({
    mutationFn: previewGradesCsv,
    onError: (error) =>
      notifications.show({
        color: "red",
        message: getErrorMessage(error, "CSV preview failed."),
      }),
  });
  const uploadMutation = useMutation({
    mutationFn: uploadGradesCsv,
    onSuccess: () =>
      notifications.show({ color: "green", message: "CSV grades uploaded." }),
    onError: (error) =>
      notifications.show({
        color: "red",
        message: getErrorMessage(error, "CSV upload failed."),
      }),
  });
  const submitMutation = useMutation({
    mutationFn: submitGrades,
    onSuccess: () =>
      notifications.show({ color: "green", message: "Grades submitted." }),
    onError: (error) =>
      notifications.show({
        color: "red",
        message: getErrorMessage(error, "Manual grade submission failed."),
      }),
  });
  const downloadTemplateMutation = useMutation({
    mutationFn: downloadGradeTemplate,
    onSuccess: (data) => downloadBlob(data, "grade_upload_template.csv"),
    onError: (error) =>
      notifications.show({
        color: "red",
        message: getErrorMessage(error, "Template download failed."),
      }),
  });

  const courseSummaryQuery = useQuery({
    queryKey: ["faculty-course-summary", analysisFilters],
    queryFn: () => fetchCourseSummary(analysisFilters),
    enabled: Boolean(
      analysisFilters.courseId &&
      analysisFilters.semesterId &&
      analysisFilters.academicYear,
    ),
  });

  const auditLogsQuery = useQuery({
    queryKey: ["faculty-audit-logs", analysisFilters.courseId],
    queryFn: () => fetchAuditLogs({ courseId: analysisFilters.courseId }),
    enabled: Boolean(analysisFilters.courseId),
  });

  const currentStudentSummary = (courseSummaryQuery.data?.students || []).find(
    (item) =>
      String(item.roll_no).toUpperCase() ===
      String(manualForm.values.student_id || "").toUpperCase(),
  );
  const isCurrentStudentVerified = Boolean(currentStudentSummary?.is_verified);
  const totalStudents = courseSummaryQuery.data?.students?.length || 0;
  const failCount = (courseSummaryQuery.data?.grade_breakdown || [])
    .filter((item) => item.letter_grade === "F")
    .reduce((acc, item) => acc + Number(item.total || 0), 0);
  const passCount = Math.max(totalStudents - failCount, 0);
  const failRate =
    totalStudents > 0 ? Math.round((failCount / totalStudents) * 100) : 0;
  const hasAnyMarks =
    manualForm.values.internal_marks !== "" ||
    manualForm.values.internal_max_marks !== "" ||
    manualForm.values.external_marks !== "" ||
    manualForm.values.external_max_marks !== "";
  const hasLetterGrade = Boolean(
    String(manualForm.values.letter_grade || "").trim(),
  );
  const courseOptions = Array.from(
    new Map(
      (facultyCoursesQuery.data || [])
        .map((item) => {
          const nestedCourse =
            item?.course_id && typeof item.course_id === "object"
              ? item.course_id
              : null;
          const id =
            item?.course_id__id ??
            item?.course_id ??
            item?.course?.id ??
            nestedCourse?.id ??
            item?.id;
          const code =
            item?.course_code ??
            item?.course_id__code ??
            item?.course?.code ??
            nestedCourse?.code ??
            item?.code;
          const name =
            item?.course_name ??
            item?.course_id__name ??
            item?.course?.name ??
            nestedCourse?.name ??
            item?.name;

          const normalizedId = String(id ?? "").trim();
          const normalizedCode = String(code ?? "").trim();
          const normalizedName = String(name ?? "").trim();

          if (!normalizedId || !normalizedCode || !normalizedName) {
            return null;
          }
          return [
            normalizedId,
            {
              value: normalizedId,
              label: `${normalizedCode} - ${normalizedName}`,
            },
          ];
        })
        .filter(Boolean),
    ).values(),
  );

  return (
    <Stack gap="lg">
      <SimpleGrid cols={{ base: 1, md: 2 }}>
        <Card withBorder radius="md">
          <Stack>
            <Text fw={700}>Manual Grade Submission</Text>
            <form
              onSubmit={manualForm.onSubmit((values) => {
                const hasMarks =
                  values.internal_marks !== "" ||
                  values.internal_max_marks !== "" ||
                  values.external_marks !== "" ||
                  values.external_max_marks !== "";
                const hasGrade = Boolean(
                  String(values.letter_grade || "").trim(),
                );
                if (hasMarks && hasGrade) {
                  notifications.show({
                    color: "red",
                    message:
                      "Provide either letter grade or internal/external marks, not both.",
                  });
                  return;
                }
                if (!hasMarks && !hasGrade) {
                  notifications.show({
                    color: "red",
                    message:
                      "Enter either letter grade or complete internal/external marks.",
                  });
                  return;
                }
                if (
                  hasMarks &&
                  (!values.internal_marks ||
                    !values.internal_max_marks ||
                    !values.external_marks ||
                    !values.external_max_marks)
                ) {
                  notifications.show({
                    color: "red",
                    message:
                      "Internal and external obtained/max marks are all required in marks mode.",
                  });
                  return;
                }
                const hasInternal =
                  values.internal_marks !== "" &&
                  values.internal_max_marks !== "";
                const hasExternal =
                  values.external_marks !== "" &&
                  values.external_max_marks !== "";
                const components = [];
                if (hasInternal) {
                  components.push({
                    component_name: "Internal",
                    max_marks: Number(values.internal_max_marks),
                    weightage: 0,
                    marks_obtained: Number(values.internal_marks),
                  });
                }
                if (hasExternal) {
                  components.push({
                    component_name: "External",
                    max_marks: Number(values.external_max_marks),
                    weightage: 0,
                    marks_obtained: Number(values.external_marks),
                  });
                }
                submitMutation.mutate({
                  course_id: Number(values.course_id),
                  semester_id: Number(values.semester_id),
                  academic_year: values.academic_year,
                  grades: [
                    {
                      student_id: values.student_id,
                      letter_grade: hasGrade ? values.letter_grade : "",
                      reason: values.reason,
                      components,
                    },
                  ],
                });
              })}
            >
              <Stack>
                <SimpleGrid cols={{ base: 1, md: 3 }}>
                  <Select
                    label="Course"
                    placeholder="Select assigned course"
                    data={courseOptions}
                    searchable
                    {...manualForm.getInputProps("course_id")}
                  />
                  <TextInput
                    label="Semester ID"
                    {...manualForm.getInputProps("semester_id")}
                  />
                  <TextInput
                    label="Academic Year"
                    {...manualForm.getInputProps("academic_year")}
                  />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, md: 2 }}>
                  <TextInput
                    label="Student Roll No"
                    {...manualForm.getInputProps("student_id")}
                  />
                  <TextInput
                    label="Letter Grade (Optional)"
                    disabled={hasAnyMarks}
                    {...manualForm.getInputProps("letter_grade")}
                  />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, md: 2 }}>
                  <TextInput
                    label="Internal Marks Obtained"
                    disabled={hasLetterGrade}
                    {...manualForm.getInputProps("internal_marks")}
                  />
                  <TextInput
                    label="Internal Max Marks"
                    disabled={hasLetterGrade}
                    {...manualForm.getInputProps("internal_max_marks")}
                  />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, md: 2 }}>
                  <TextInput
                    label="External Marks Obtained"
                    disabled={hasLetterGrade}
                    {...manualForm.getInputProps("external_marks")}
                  />
                  <TextInput
                    label="External Max Marks"
                    disabled={hasLetterGrade}
                    {...manualForm.getInputProps("external_max_marks")}
                  />
                </SimpleGrid>
                <Textarea
                  label="Reason"
                  {...manualForm.getInputProps("reason")}
                />
                {isCurrentStudentVerified && (
                  <Alert color="yellow">
                    This student&apos;s grade is already verified and cannot be
                    resubmitted by faculty.
                  </Alert>
                )}
                <Group justify="flex-end">
                  <Button
                    type="submit"
                    loading={submitMutation.isPending}
                    disabled={isCurrentStudentVerified}
                  >
                    Submit Grade
                  </Button>
                </Group>
                {submitMutation.isError && (
                  <Alert color="red" title="Submission Error">
                    {getErrorMessage(
                      submitMutation.error,
                      "Unable to submit grade right now.",
                    )}
                  </Alert>
                )}
              </Stack>
            </form>
          </Stack>
        </Card>
        <Card withBorder radius="md">
          <Stack>
            <Text fw={700}>CSV Workflow</Text>
            <GradeUploadForm
              busy={previewMutation.isPending || uploadMutation.isPending}
              courseOptions={courseOptions}
              onPreview={(values) =>
                previewMutation.mutate({ file: values.file })
              }
              onUpload={(values) =>
                uploadMutation.mutate({
                  courseId: values.courseId,
                  semesterId: values.semesterId,
                  academicYear: values.academicYear,
                  file: values.file,
                })
              }
            />
            <Group justify="flex-end">
              <Button
                variant="default"
                onClick={() => downloadTemplateMutation.mutate()}
                loading={downloadTemplateMutation.isPending}
              >
                Download Template
              </Button>
            </Group>
            {previewMutation.data?.errors?.length > 0 && (
              <Alert color="red" title="CSV Errors">
                {previewMutation.data.errors.join(" ")}
              </Alert>
            )}
            {previewMutation.data?.rows?.length > 0 && (
              <Alert color="blue">
                CSV validated. Letter grades were derived where marks columns
                were provided.
              </Alert>
            )}
            {uploadMutation.isError && (
              <Alert color="red" title="Upload Error">
                {getErrorMessage(
                  uploadMutation.error,
                  "Unable to upload CSV file.",
                )}
              </Alert>
            )}
          </Stack>
        </Card>
      </SimpleGrid>
      {previewMutation.data?.rows?.length > 0 && (
        <Card withBorder radius="md">
          <Stack>
            <Text fw={700}>CSV Preview</Text>
            <GradeTable
              rows={previewMutation.data.rows.map((row) => ({
                ...row,
                student_name: "Preview row",
                grade_points: "-",
                is_verified: false,
              }))}
            />
          </Stack>
        </Card>
      )}
      {dashboardQuery.data?.announcements?.length > 0 && (
        <Card withBorder radius="md">
          <Stack>
            <Text fw={700}>Latest Announcements</Text>
            {dashboardQuery.data.announcements.map((announcement) => (
              <Alert
                key={announcement.id}
                color="blue"
                variant="light"
                title={announcement.title}
              >
                {announcement.message}
              </Alert>
            ))}
          </Stack>
        </Card>
      )}
      <Card withBorder radius="md">
        <Stack>
          <Text fw={700}>Course Performance Snapshot</Text>
          {courseSummaryQuery.data ? (
            <>
              <Group grow>
                <Alert color="green">Pass: {passCount}</Alert>
                <Alert color="red">Fail: {failCount}</Alert>
              </Group>
              {(courseSummaryQuery.data.grade_breakdown || []).map((row) => (
                <div key={row.letter_grade}>
                  <Group justify="space-between">
                    <Text size="sm">{row.letter_grade}</Text>
                    <Text size="sm">{row.total}</Text>
                  </Group>
                  <Progress
                    value={
                      totalStudents
                        ? (Number(row.total) / totalStudents) * 100
                        : 0
                    }
                  />
                </div>
              ))}
              {failRate > 25 && (
                <Alert color="orange">
                  Moderation suggestion: fail rate is {failRate}%. Review
                  borderline scripts before final verification.
                </Alert>
              )}
            </>
          ) : (
            <Alert color="gray">
              Enter course, semester, and academic year to view performance.
            </Alert>
          )}
          {courseSummaryQuery.isError && (
            <Alert color="red">
              Unable to load course performance summary.
            </Alert>
          )}
        </Stack>
      </Card>
      <Card withBorder radius="md">
        <Stack>
          <Text fw={700}>My Submission History</Text>
          {auditLogsQuery.data?.length ? (
            auditLogsQuery.data.map((log) => (
              <Alert
                key={`${log.student__id__id}-${log.timestamp}`}
                color="gray"
                variant="light"
              >
                {log.student__id__id} | {log.course__code} |{" "}
                {log.old_grade || "NA"} to {log.new_grade} | {log.reason}
              </Alert>
            ))
          ) : (
            <Alert color="blue">
              Submission edits and resubmissions will appear here.
            </Alert>
          )}
          {auditLogsQuery.isError && (
            <Alert color="red">Unable to load submission history.</Alert>
          )}
        </Stack>
      </Card>
      {dashboardQuery.isLoading && (
        <Alert color="blue">Loading dashboard snapshot...</Alert>
      )}
      {dashboardQuery.isError && (
        <Alert color="red">Unable to load dashboard snapshot.</Alert>
      )}
      {facultyCoursesQuery.isError && (
        <Alert color="red">
          {getErrorMessage(
            facultyCoursesQuery.error,
            "Unable to load assigned courses.",
          )}
        </Alert>
      )}
    </Stack>
  );
}
