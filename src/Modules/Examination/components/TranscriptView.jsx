import PropTypes from "prop-types";
import { Card, Grid, Group, Stack, Table, Text, Title } from "@mantine/core";

export default function TranscriptView({ transcript }) {
  return (
    <Stack gap="md">
      <Card withBorder radius="md">
        <Group justify="space-between">
          <div>
            <Title order={4}>{transcript.student_name}</Title>
            <Text c="dimmed">{transcript.student_id}</Text>
          </div>
          <Group>
            <Text fw={700}>CPI: {transcript.cpi}</Text>
          </Group>
        </Group>
      </Card>
      <Grid>
        {Object.entries(transcript.semesters || {}).map(
          ([semesterName, rows]) => (
            <Grid.Col key={semesterName} span={{ base: 12, md: 6 }}>
              <Card withBorder radius="md" h="100%">
                <Stack gap="sm">
                  <Group justify="space-between">
                    <Title order={5}>{semesterName}</Title>
                    <Text fw={700}>
                      SPI: {transcript.spi?.[semesterName] ?? 0}
                    </Text>
                  </Group>
                  <Table withTableBorder>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Course</Table.Th>
                        <Table.Th>Credits</Table.Th>
                        <Table.Th>Grade</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {rows.map((row) => (
                        <Table.Tr key={`${semesterName}-${row.course_code}`}>
                          <Table.Td>{row.course_code}</Table.Td>
                          <Table.Td>{row.credits}</Table.Td>
                          <Table.Td>{row.letter_grade}</Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </Stack>
              </Card>
            </Grid.Col>
          ),
        )}
      </Grid>
    </Stack>
  );
}

TranscriptView.propTypes = {
  transcript: PropTypes.shape({
    student_name: PropTypes.string,
    student_id: PropTypes.string,
    cpi: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    spi: PropTypes.shape({}),
    semesters: PropTypes.shape({}),
  }).isRequired,
};
