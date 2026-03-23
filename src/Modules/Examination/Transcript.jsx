import { useMutation, useQuery } from "@tanstack/react-query";
import { Alert, Button, Card, Group, Stack, Text } from "@mantine/core";
import { fetchStudentTranscript } from "./api";
import TranscriptView from "./components/TranscriptView";

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

export default function Transcript() {
  const transcriptQuery = useQuery({
    queryKey: ["student-transcript"],
    queryFn: () => fetchStudentTranscript({ format: "json" }),
  });

  const downloadMutation = useMutation({
    mutationFn: () => fetchStudentTranscript({ format: "pdf" }),
    onSuccess: (data) => downloadBlob(data, "transcript.pdf"),
  });

  return (
    <Stack gap="lg">
      <Card withBorder radius="md">
        <Group justify="space-between">
          <div>
            <Text fw={700}>Transcript</Text>
            <Text c="dimmed">Semester-wise performance with SPI and CPI.</Text>
          </div>
          <Button
            onClick={() => downloadMutation.mutate()}
            loading={downloadMutation.isPending}
          >
            Download PDF
          </Button>
        </Group>
      </Card>
      {transcriptQuery.data ? (
        <TranscriptView transcript={transcriptQuery.data} />
      ) : (
        <Alert color="yellow">
          {transcriptQuery.isLoading
            ? "Loading transcript..."
            : "Transcript will appear here once published data exists."}
        </Alert>
      )}
      {downloadMutation.isError && (
        <Alert color="red">
          {downloadMutation.error?.response?.data?.detail ||
            "Unable to download transcript PDF."}
        </Alert>
      )}
      {transcriptQuery.isError && (
        <Alert color="red">
          {transcriptQuery.error?.response?.data?.detail ||
            "Unable to load transcript."}
        </Alert>
      )}
    </Stack>
  );
}
