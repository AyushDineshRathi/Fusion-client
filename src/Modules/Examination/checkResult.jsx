import { useMutation, useQuery } from "@tanstack/react-query";
import { Alert, Button, Card, Group, Select, Stack, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import {
  fetchMarksheet,
  fetchStudentResults,
  fetchStudentSemesters,
  requestReevaluation,
} from "./api";
import ResultTable from "./components/ResultTable";
import ReevaluationForm from "./components/ReevaluationForm";

function downloadBlob(blob, fileName) {
  const fileBlob =
    blob instanceof Blob ? blob : new Blob([blob], { type: "application/pdf" });
  const url = window.URL.createObjectURL(fileBlob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  window.URL.revokeObjectURL(url);
}

export default function CheckResult() {
  const semesterQuery = useQuery({
    queryKey: ["student-semesters"],
    queryFn: fetchStudentSemesters,
  });

  const [selectedSemesterId, setSelectedSemesterId] = useState(null);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState(null);
  const [hasSelectedFilters, setHasSelectedFilters] = useState(false);

  const selectedSemester = (semesterQuery.data || []).find(
    (item) => String(item.semester_id) === String(selectedSemesterId),
  );

  const resultQuery = useQuery({
    queryKey: ["student-results", selectedSemesterId, selectedAcademicYear],
    queryFn: () =>
      fetchStudentResults({
        semesterId: selectedSemesterId,
        academicYear: selectedAcademicYear,
      }),
    enabled: Boolean(
      hasSelectedFilters && selectedSemesterId && selectedAcademicYear,
    ),
  });

  const marksheetMutation = useMutation({
    mutationFn: fetchMarksheet,
    onSuccess: (data) => downloadBlob(data, "marksheet.pdf"),
  });

  const reevaluationMutation = useMutation({
    mutationFn: requestReevaluation,
    onSuccess: () =>
      notifications.show({
        color: "green",
        message: "Re-evaluation request submitted.",
      }),
  });

  return (
    <Stack gap="lg">
      <Card withBorder radius="md">
        <Group justify="space-between">
          <div>
            <Text fw={700}>Semester Results</Text>
            <Text c="dimmed">
              Published results are visible after academic admin approval.
            </Text>
          </div>
          <Select
            value={selectedSemesterId}
            placeholder="Select semester"
            data={(semesterQuery.data || []).map((semester) => ({
              value: String(semester.semester_id),
              label: `Semester ${semester.semester_no}`,
            }))}
            onChange={(value) => {
              setHasSelectedFilters(Boolean(value));
              setSelectedSemesterId(value);
              const semesterRecord = (semesterQuery.data || []).find(
                (item) => String(item.semester_id) === String(value),
              );
              setSelectedAcademicYear(
                semesterRecord?.academic_years?.[0] || null,
              );
            }}
          />
          <Select
            value={selectedAcademicYear}
            placeholder="Select academic year"
            data={(selectedSemester?.academic_years || []).map((year) => ({
              value: year,
              label: year,
            }))}
            onChange={(value) => {
              setSelectedAcademicYear(value);
              if (selectedSemesterId) {
                setHasSelectedFilters(true);
              }
            }}
          />
        </Group>
      </Card>
      <Card withBorder radius="md">
        {resultQuery.data?.results?.length ? (
          <Stack>
            <ResultTable rows={resultQuery.data.results} />
            <Group justify="space-between">
              <Text fw={700}>CPI: {resultQuery.data.cpi}</Text>
              <Button
                onClick={() =>
                  marksheetMutation.mutate({
                    semesterId: selectedSemesterId,
                    academicYear: selectedAcademicYear,
                    semesterNo: selectedSemester?.semester_no,
                  })
                }
                loading={marksheetMutation.isPending}
              >
                Download Marksheet
              </Button>
            </Group>
          </Stack>
        ) : (
          <Alert color="yellow">
            {!hasSelectedFilters
              ? "Select semester and academic year to view results."
              : resultQuery.isLoading
                ? "Loading results..."
                : "No published results found yet."}
          </Alert>
        )}
        {resultQuery.isError && (
          <Alert color="red">
            {resultQuery.error?.response?.data?.detail ||
              "Unable to load results for selected semester."}
          </Alert>
        )}
      </Card>
      <ReevaluationForm
        onSubmit={(values) => {
          const courseId = Number(values.course_id);
          const semesterId = Number(values.semester_id || selectedSemesterId);
          const academicYear = values.academic_year || selectedAcademicYear;
          if (!courseId || !semesterId || !academicYear || !values.reason) {
            notifications.show({
              color: "red",
              message:
                "Please select valid course/semester/year and enter reason.",
            });
            return;
          }
          reevaluationMutation.mutate({
            course_id: courseId,
            semester_id: semesterId,
            academic_year: academicYear,
            reason: values.reason,
          });
        }}
        busy={reevaluationMutation.isPending}
        defaultSemesterId={selectedSemesterId}
        defaultAcademicYear={selectedAcademicYear}
        semesterOptions={(semesterQuery.data || []).map((semester) => ({
          value: String(semester.semester_id),
          label: `Semester ${semester.semester_no}`,
        }))}
        academicYearOptions={(selectedSemester?.academic_years || []).map(
          (year) => ({
            value: year,
            label: year,
          }),
        )}
        courseOptions={(resultQuery.data?.results || []).map((row) => ({
          value: String(row.course_id),
          label: `${row.course_code} - ${row.course_name}`,
        }))}
      />
      {reevaluationMutation.isError && (
        <Alert color="red">
          {reevaluationMutation.error?.response?.data?.detail ||
            "Unable to submit re-evaluation request."}
        </Alert>
      )}
      {semesterQuery.isError && (
        <Alert color="red">Unable to load semester options.</Alert>
      )}
    </Stack>
  );
}
