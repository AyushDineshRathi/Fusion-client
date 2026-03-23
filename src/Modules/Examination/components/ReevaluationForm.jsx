import PropTypes from "prop-types";
import { Button, Paper, Select, Stack, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect } from "react";

export default function ReevaluationForm({
  onSubmit,
  busy,
  defaultSemesterId,
  defaultAcademicYear,
  semesterOptions,
  academicYearOptions,
  courseOptions,
}) {
  const form = useForm({
    initialValues: {
      course_id: "",
      semester_id: defaultSemesterId || "",
      academic_year: defaultAcademicYear || "",
      reason: "",
    },
  });

  useEffect(() => {
    if (defaultSemesterId) {
      form.setFieldValue("semester_id", String(defaultSemesterId));
    }
    if (defaultAcademicYear) {
      form.setFieldValue("academic_year", defaultAcademicYear);
    }
  }, [defaultSemesterId, defaultAcademicYear]);

  const courseInput = form.getInputProps("course_id");
  const semesterInput = form.getInputProps("semester_id");
  const yearInput = form.getInputProps("academic_year");
  const reasonInput = form.getInputProps("reason");

  return (
    <Paper withBorder radius="md" p="md">
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Stack>
          <Select
            label="Course"
            placeholder="Select course"
            data={courseOptions}
            searchable
            value={courseInput.value}
            onChange={courseInput.onChange}
            onBlur={courseInput.onBlur}
            error={courseInput.error}
          />
          <Select
            label="Semester ID"
            placeholder="Select semester"
            data={semesterOptions}
            value={semesterInput.value}
            onChange={semesterInput.onChange}
            onBlur={semesterInput.onBlur}
            error={semesterInput.error}
          />
          <Select
            label="Academic Year"
            placeholder="Select academic year"
            data={academicYearOptions}
            value={yearInput.value}
            onChange={yearInput.onChange}
            onBlur={yearInput.onBlur}
            error={yearInput.error}
          />
          <Textarea
            label="Reason for review"
            minRows={3}
            value={reasonInput.value}
            onChange={reasonInput.onChange}
            onBlur={reasonInput.onBlur}
            error={reasonInput.error}
          />
          <Button type="submit" loading={busy}>
            Submit Re-evaluation Request
          </Button>
        </Stack>
      </form>
    </Paper>
  );
}

ReevaluationForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  busy: PropTypes.bool,
  defaultSemesterId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  defaultAcademicYear: PropTypes.string,
  semesterOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ),
  academicYearOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ),
  courseOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ),
};

ReevaluationForm.defaultProps = {
  busy: false,
  defaultSemesterId: "",
  defaultAcademicYear: "",
  semesterOptions: [],
  academicYearOptions: [],
  courseOptions: [],
};
