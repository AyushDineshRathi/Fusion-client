import PropTypes from "prop-types";
import {
  Button,
  FileInput,
  Group,
  Paper,
  Select,
  SimpleGrid,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";

export default function GradeUploadForm({
  onPreview,
  onUpload,
  busy,
  courseOptions,
}) {
  const form = useForm({
    initialValues: {
      courseId: "",
      semesterId: "",
      academicYear: "",
      file: null,
    },
  });

  const handlePreview = form.onSubmit((values) => onPreview(values));
  const handleUpload = form.onSubmit((values) => onUpload(values));

  return (
    <Paper withBorder radius="md" p="md">
      <SimpleGrid cols={{ base: 1, md: 4 }}>
        <Select
          label="Course"
          placeholder="Select course"
          data={courseOptions}
          searchable
          {...form.getInputProps("courseId")}
        />
        <TextInput label="Semester ID" {...form.getInputProps("semesterId")} />
        <TextInput
          label="Academic Year"
          placeholder="2025-26"
          {...form.getInputProps("academicYear")}
        />
        <FileInput
          label="CSV File"
          accept=".csv"
          {...form.getInputProps("file")}
        />
      </SimpleGrid>
      <Group justify="flex-end" mt="md">
        <Button variant="default" onClick={handlePreview} loading={busy}>
          Preview CSV
        </Button>
        <Button onClick={handleUpload} loading={busy}>
          Upload CSV
        </Button>
      </Group>
    </Paper>
  );
}

GradeUploadForm.propTypes = {
  onPreview: PropTypes.func.isRequired,
  onUpload: PropTypes.func.isRequired,
  busy: PropTypes.bool,
  courseOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ),
};

GradeUploadForm.defaultProps = {
  busy: false,
  courseOptions: [],
};
