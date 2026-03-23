import { useQuery } from "@tanstack/react-query";
import {
  Alert,
  Card,
  Group,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { fetchAuditLogs, validateGrades } from "./api";
import GradeTable from "./components/GradeTable";

export default function ValidateGrades() {
  const form = useForm({
    initialValues: {
      courseId: "",
      semesterId: "",
      academicYear: "",
    },
  });

  const validationQuery = useQuery({
    queryKey: ["validate-grades", form.values],
    queryFn: () => validateGrades(form.values),
    enabled: Boolean(
      form.values.courseId &&
      form.values.semesterId &&
      form.values.academicYear,
    ),
  });

  const auditQuery = useQuery({
    queryKey: ["grade-audit", form.values.courseId],
    queryFn: () => fetchAuditLogs({ courseId: form.values.courseId }),
    enabled: Boolean(form.values.courseId),
  });

  return (
    <Stack gap="lg">
      <Card withBorder radius="md">
        <form onSubmit={form.onSubmit(() => {})}>
          <SimpleGrid cols={{ base: 1, md: 3 }}>
            <TextInput label="Course ID" {...form.getInputProps("courseId")} />
            <TextInput
              label="Semester ID"
              {...form.getInputProps("semesterId")}
            />
            <TextInput
              label="Academic Year"
              {...form.getInputProps("academicYear")}
            />
          </SimpleGrid>
        </form>
      </Card>
      <Card withBorder radius="md">
        <Stack>
          <Group justify="space-between">
            <Text fw={700}>Validation Queue</Text>
            <Text c="dimmed">
              Dean can inspect grade distribution before verification.
            </Text>
          </Group>
          {validationQuery.data?.students?.length ? (
            <GradeTable rows={validationQuery.data.students} />
          ) : (
            <Alert color="yellow">
              {validationQuery.isLoading
                ? "Loading validation queue..."
                : "Enter course, semester, and academic year to load grades."}
            </Alert>
          )}
          {validationQuery.isError && (
            <Alert color="red">
              {validationQuery.error?.response?.data?.detail ||
                "Unable to load validation queue."}
            </Alert>
          )}
        </Stack>
      </Card>
      <Card withBorder radius="md">
        <Stack>
          <Text fw={700}>Grade Audit Log</Text>
          {auditQuery.data?.length ? (
            auditQuery.data.map((item) => (
              <Alert
                key={`${item.student__id__id}-${item.timestamp}`}
                color="gray"
                variant="light"
              >
                {item.student__id__id} | {item.course__code} |{" "}
                {item.old_grade || "NA"} to {item.new_grade} | {item.reason}
              </Alert>
            ))
          ) : (
            <Alert color="blue">
              {auditQuery.isLoading
                ? "Loading audit logs..."
                : "Audit entries will appear here after grade edits."}
            </Alert>
          )}
          {auditQuery.isError && (
            <Alert color="red">Unable to load audit logs.</Alert>
          )}
        </Stack>
      </Card>
    </Stack>
  );
}
