import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Alert,
  Button,
  Card,
  Group,
  MultiSelect,
  Select,
  Stack,
  Text,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import {
  createAnnouncement,
  exportBatchResultExcel,
  fetchAcadAdminOptions,
  fetchAnnouncements,
  publishResults,
  sendReminders,
} from "./api";
import AnnouncementForm from "./components/AnnouncementForm";

export default function Announcement() {
  const [batchId, setBatchId] = useState(null);
  const [semesterId, setSemesterId] = useState(null);
  const [academicYear, setAcademicYear] = useState(null);
  const [courseIds, setCourseIds] = useState([]);

  const downloadBlob = (blob, fileName) => {
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = fileName;
    anchor.click();
    window.URL.revokeObjectURL(url);
  };

  const optionsQuery = useQuery({
    queryKey: ["acad-admin-options"],
    queryFn: fetchAcadAdminOptions,
  });
  useEffect(() => {
    if (optionsQuery.data) {
      setBatchId((prev) => prev || String(optionsQuery.data?.batches?.[0]?.id || ""));
      setSemesterId((prev) => prev || String(optionsQuery.data?.semesters?.[0]?.id || ""));
      setAcademicYear((prev) => prev || optionsQuery.data?.academic_years?.[0] || "");
    }
  }, [optionsQuery.data]);

  const announcementsQuery = useQuery({
    queryKey: ["exam-announcements"],
    queryFn: fetchAnnouncements,
  });
  const announcementMutation = useMutation({
    mutationFn: createAnnouncement,
    onSuccess: () =>
      notifications.show({ color: "green", message: "Announcement posted." }),
  });
  const publishMutation = useMutation({
    mutationFn: publishResults,
    onSuccess: () =>
      notifications.show({ color: "green", message: "Results published." }),
    onError: () =>
      notifications.show({ color: "red", message: "Failed to publish results." }),
  });
  const reminderMutation = useMutation({
    mutationFn: sendReminders,
    onSuccess: () =>
      notifications.show({
        color: "green",
        message: "Reminder notifications sent.",
      }),
    onError: () =>
      notifications.show({ color: "red", message: "Failed to send reminders." }),
  });
  const exportMutation = useMutation({
    mutationFn: exportBatchResultExcel,
    onSuccess: (data) => downloadBlob(data, "batch_results.xlsx"),
    onError: () =>
      notifications.show({ color: "red", message: "Export failed." }),
  });

  const courseOptions = (optionsQuery.data?.courses || []).map((course) => ({
    value: String(course.id),
    label: `${course.code} - ${course.name}`,
  }));
  const batchOptions = (optionsQuery.data?.batches || []).map((batch) => ({
    value: String(batch.id),
    label: batch.label,
  }));
  const semesterOptions = (optionsQuery.data?.semesters || []).map((semester) => ({
    value: String(semester.id),
    label: `Semester ${semester.semester_no}`,
  }));
  const yearOptions = (optionsQuery.data?.academic_years || []).map((year) => ({
    value: year,
    label: year,
  }));
  const canRunActions = Boolean(batchId && semesterId && academicYear);

  return (
    <Stack gap="lg">
      <AnnouncementForm
        onSubmit={announcementMutation.mutate}
        busy={announcementMutation.isPending}
      />
      <Card withBorder radius="md">
        <Stack>
          <Text fw={700}>Academic Actions</Text>
          <Group grow>
            <Select
              label="Batch"
              value={batchId}
              data={batchOptions}
              onChange={setBatchId}
              searchable
            />
            <Select
              label="Semester"
              value={semesterId}
              data={semesterOptions}
              onChange={setSemesterId}
            />
            <Select
              label="Academic Year"
              value={academicYear}
              data={yearOptions}
              onChange={setAcademicYear}
            />
          </Group>
          <MultiSelect
            label="Courses for reminder"
            value={courseIds}
            data={courseOptions}
            onChange={setCourseIds}
            searchable
            clearable
          />
          <Group>
            <Button
              onClick={() =>
                publishMutation.mutate({
                  batch_id: Number(batchId),
                  semester_id: Number(semesterId),
                  academic_year: academicYear,
                })
              }
              disabled={!canRunActions}
              loading={publishMutation.isPending}
            >
              Publish Results
            </Button>
            <Button
              variant="default"
              onClick={() =>
                exportMutation.mutate({
                  batchId: Number(batchId),
                  semesterId: Number(semesterId),
                  academicYear,
                })
              }
              disabled={!canRunActions}
              loading={exportMutation.isPending}
            >
              Export Excel
            </Button>
            <Button
              color="orange"
              onClick={() =>
                reminderMutation.mutate({
                  course_ids: courseIds.map((id) => Number(id)),
                  deadline_label: "next grade deadline",
                })
              }
              disabled={courseIds.length === 0}
              loading={reminderMutation.isPending}
            >
              Send Reminder
            </Button>
          </Group>
          {(publishMutation.isError || reminderMutation.isError || exportMutation.isError) && (
            <Alert color="red">
              {publishMutation.error?.response?.data?.detail ||
                reminderMutation.error?.response?.data?.detail ||
                exportMutation.error?.response?.data?.detail ||
                "Action failed."}
            </Alert>
          )}
        </Stack>
      </Card>
      <Card withBorder radius="md">
        <Stack>
          <Text fw={700}>Published Announcements</Text>
          {announcementsQuery.isLoading && (
            <Alert color="blue">Loading announcements...</Alert>
          )}
          {announcementsQuery.data?.length ? (
            announcementsQuery.data.map((item) => (
              <Alert
                key={item.id}
                color="blue"
                variant="light"
                title={item.title}
              >
                {item.message}
              </Alert>
            ))
          ) : (
            <Alert color="gray">No announcements yet.</Alert>
          )}
        </Stack>
      </Card>
      {optionsQuery.isError && (
        <Alert color="red">Unable to load admin action options.</Alert>
      )}
      {optionsQuery.isLoading && (
        <Alert color="blue">Loading admin options...</Alert>
      )}
    </Stack>
  );
}
