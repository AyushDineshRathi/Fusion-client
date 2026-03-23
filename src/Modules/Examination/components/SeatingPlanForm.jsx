import PropTypes from "prop-types";
import {
  Button,
  Group,
  NumberInput,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";

export default function SeatingPlanForm({
  onSubmit,
  busy,
  courseOptions,
  semesterOptions,
  academicYearOptions,
}) {
  const form = useForm({
    initialValues: {
      exam_name: "",
      course_id: "",
      semester_id: "",
      academic_year: "",
      exam_date: "",
      hall_one_name: "",
      hall_one_capacity: 30,
      hall_two_name: "",
      hall_two_capacity: 30,
    },
  });

  return (
    <Paper withBorder radius="md" p="md">
      <form
        onSubmit={form.onSubmit((values) =>
          onSubmit({
            exam_name: values.exam_name,
            course_id: Number(values.course_id),
            semester_id: Number(values.semester_id),
            academic_year: values.academic_year,
            exam_date: values.exam_date,
            halls: [
              {
                hall_name: values.hall_one_name,
                capacity: values.hall_one_capacity,
              },
              {
                hall_name: values.hall_two_name,
                capacity: values.hall_two_capacity,
              },
            ].filter((hall) => hall.hall_name),
          }),
        )}
      >
        <Stack>
          <SimpleGrid cols={{ base: 1, md: 3 }}>
            <Select label="Exam Name" data={[
              { value: "Mid Semester", label: "Mid Semester" },
              { value: "End Semester", label: "End Semester" },
              { value: "Quiz Examination", label: "Quiz Examination" },
            ]} {...form.getInputProps("exam_name")} />
            <Select
              label="Course"
              data={courseOptions}
              searchable
              {...form.getInputProps("course_id")}
            />
            <Select
              label="Semester"
              data={semesterOptions}
              {...form.getInputProps("semester_id")}
            />
            <Select
              label="Academic Year"
              data={academicYearOptions}
              {...form.getInputProps("academic_year")}
            />
            <TextInput
              label="Exam Date"
              placeholder="YYYY-MM-DD"
              {...form.getInputProps("exam_date")}
            />
          </SimpleGrid>
          <SimpleGrid cols={{ base: 1, md: 2 }}>
            <Group grow align="flex-end">
              <TextInput
                label="Hall 1"
                {...form.getInputProps("hall_one_name")}
              />
              <NumberInput
                label="Capacity"
                min={1}
                {...form.getInputProps("hall_one_capacity")}
              />
            </Group>
            <Group grow align="flex-end">
              <TextInput
                label="Hall 2"
                {...form.getInputProps("hall_two_name")}
              />
              <NumberInput
                label="Capacity"
                min={1}
                {...form.getInputProps("hall_two_capacity")}
              />
            </Group>
          </SimpleGrid>
          <Button type="submit" loading={busy}>
            Generate Seating Plan
          </Button>
        </Stack>
      </form>
    </Paper>
  );
}

SeatingPlanForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  busy: PropTypes.bool,
  courseOptions: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string,
    label: PropTypes.string,
  })),
  semesterOptions: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string,
    label: PropTypes.string,
  })),
  academicYearOptions: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string,
    label: PropTypes.string,
  })),
};

SeatingPlanForm.defaultProps = {
  busy: false,
  courseOptions: [],
  semesterOptions: [],
  academicYearOptions: [],
};
