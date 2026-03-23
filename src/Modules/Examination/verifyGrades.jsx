import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Alert,
  Button,
  Card,
  Group,
  Select,
  Stack,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useForm } from "@mantine/form";
import {
  fetchAcadAdminOptions,
  fetchReevaluationRequests,
  resolveReevaluation,
  updateGrade,
  verifyGrades,
} from "./api";

export default function VerifyGrades() {
  const form = useForm({
    initialValues: {
      course_id: "",
      semester_id: "",
      academic_year: "",
    },
  });
  const updateForm = useForm({
    initialValues: {
      student_id: "",
      course_id: "",
      semester_id: "",
      academic_year: "",
      new_grade: "",
      reason: "",
    },
  });

  const optionsQuery = useQuery({
    queryKey: ["acad-admin-options"],
    queryFn: fetchAcadAdminOptions,
  });

  const verifyMutation = useMutation({
    mutationFn: verifyGrades,
    onSuccess: () =>
      notifications.show({ color: "green", message: "Grades verified." }),
  });

  const resolveMutation = useMutation({
    mutationFn: resolveReevaluation,
    onSuccess: () =>
      notifications.show({ color: "green", message: "Re-evaluation updated." }),
  });
  const updateMutation = useMutation({
    mutationFn: updateGrade,
    onSuccess: () =>
      notifications.show({ color: "green", message: "Grade updated successfully." }),
    onError: () =>
      notifications.show({ color: "red", message: "Grade update failed." }),
  });

  const reevaluationQuery = useQuery({
    queryKey: ["reevaluation-requests"],
    queryFn: fetchReevaluationRequests,
  });

  return (
    <Stack gap="lg">
      <Card withBorder radius="md">
        <form
          onSubmit={form.onSubmit((values) =>
            verifyMutation.mutate({
              ...values,
              course_id: Number(values.course_id),
              semester_id: Number(values.semester_id),
            }))}
        >
          <Stack>
            <Text fw={700}>Dean Verification</Text>
            <Group grow>
              <TextInput
                label="Course ID"
                {...form.getInputProps("course_id")}
              />
              <TextInput
                label="Semester ID"
                {...form.getInputProps("semester_id")}
              />
              <TextInput
                label="Academic Year"
                {...form.getInputProps("academic_year")}
              />
            </Group>
            <Group justify="flex-end">
              <Button type="submit" loading={verifyMutation.isPending}>
                Verify Grades
              </Button>
            </Group>
            {verifyMutation.isError && (
              <Alert color="red">
                {verifyMutation.error?.response?.data?.detail ||
                  "Unable to verify grades."}
              </Alert>
            )}
          </Stack>
        </form>
      </Card>
      <Card withBorder radius="md">
        <form
          onSubmit={updateForm.onSubmit((values) =>
            updateMutation.mutate({
              ...values,
              course_id: Number(values.course_id),
              semester_id: Number(values.semester_id),
            }))}
        >
          <Stack>
            <Text fw={700}>Dean Grade Update</Text>
            <Group grow>
              <TextInput
                label="Student Roll No"
                {...updateForm.getInputProps("student_id")}
              />
              <Select
                label="Course"
                data={(optionsQuery.data?.courses || []).map((course) => ({
                  value: String(course.id),
                  label: `${course.code} - ${course.name}`,
                }))}
                searchable
                {...updateForm.getInputProps("course_id")}
              />
              <Select
                label="Semester"
                data={(optionsQuery.data?.semesters || []).map((semester) => ({
                  value: String(semester.id),
                  label: `Semester ${semester.semester_no}`,
                }))}
                {...updateForm.getInputProps("semester_id")}
              />
              <Select
                label="Academic Year"
                data={(optionsQuery.data?.academic_years || []).map((year) => ({
                  value: year,
                  label: year,
                }))}
                {...updateForm.getInputProps("academic_year")}
              />
              <Select
                label="New Grade"
                data={["O", "A+", "A", "B+", "B", "C+", "C", "D+", "D", "F"]}
                {...updateForm.getInputProps("new_grade")}
              />
            </Group>
            <Textarea
              label="Reason"
              minRows={2}
              {...updateForm.getInputProps("reason")}
            />
            <Group justify="flex-end">
              <Button type="submit" loading={updateMutation.isPending}>
                Update Grade
              </Button>
            </Group>
            {updateMutation.isError && (
              <Alert color="red">
                {updateMutation.error?.response?.data?.detail ||
                  "Unable to update grade."}
              </Alert>
            )}
          </Stack>
        </form>
      </Card>
      <Card withBorder radius="md">
        <Stack>
          <Text fw={700}>Re-evaluation Workflow</Text>
          {reevaluationQuery.data?.length ? (
            reevaluationQuery.data.map((item) => (
              <Alert
                key={item.id}
                color="yellow"
                title={`${item.student_id} - ${item.course_code}`}
              >
                <Stack gap="xs">
                  <Text>{item.reason}</Text>
                  <Group>
                    <Button
                      size="xs"
                      loading={resolveMutation.isPending}
                      disabled={resolveMutation.isPending}
                      onClick={() =>
                        resolveMutation.mutate({
                          request_id: item.id,
                          status_value: "in_review",
                          resolution_note: "Under review",
                        })
                      }
                    >
                      Mark In Review
                    </Button>
                    <Button
                      size="xs"
                      color="green"
                      loading={resolveMutation.isPending}
                      disabled={resolveMutation.isPending}
                      onClick={() =>
                        resolveMutation.mutate({
                          request_id: item.id,
                          status_value: "resolved",
                          resolution_note: "Resolved by dean",
                        })
                      }
                    >
                      Resolve
                    </Button>
                  </Group>
                </Stack>
              </Alert>
            ))
          ) : (
            <Alert color="blue">No re-evaluation requests yet.</Alert>
          )}
          {reevaluationQuery.isError && (
            <Alert color="red">Unable to load re-evaluation requests.</Alert>
          )}
          {resolveMutation.isError && (
            <Alert color="red">
              {resolveMutation.error?.response?.data?.detail ||
                "Unable to update re-evaluation request."}
            </Alert>
          )}
        </Stack>
      </Card>
    </Stack>
  );
}
