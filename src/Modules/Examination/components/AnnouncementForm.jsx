import PropTypes from "prop-types";
import {
  Button,
  Paper,
  Select,
  Stack,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";

export default function AnnouncementForm({ onSubmit, busy }) {
  const form = useForm({
    initialValues: {
      title: "",
      message: "",
      audience: "all",
    },
  });

  return (
    <Paper withBorder radius="md" p="md">
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Stack>
          <TextInput label="Title" {...form.getInputProps("title")} />
          <Select
            label="Audience"
            data={[
              { value: "all", label: "All" },
              { value: "student", label: "Students" },
              { value: "faculty", label: "Faculty" },
              { value: "acadadmin", label: "Academic Admin" },
            ]}
            {...form.getInputProps("audience")}
          />
          <Textarea
            label="Message"
            minRows={4}
            {...form.getInputProps("message")}
          />
          <Button type="submit" loading={busy}>
            Publish Announcement
          </Button>
        </Stack>
      </form>
    </Paper>
  );
}

AnnouncementForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  busy: PropTypes.bool,
};

AnnouncementForm.defaultProps = {
  busy: false,
};
