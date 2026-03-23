import PropTypes from "prop-types";
import { Badge, ScrollArea, Table } from "@mantine/core";

export default function ResultTable({ rows }) {
  return (
    <ScrollArea>
      <Table striped withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Course</Table.Th>
            <Table.Th>Title</Table.Th>
            <Table.Th>Credits</Table.Th>
            <Table.Th>Grade</Table.Th>
            <Table.Th>Points</Table.Th>
            <Table.Th>Verification</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {rows.map((row) => (
            <Table.Tr key={`${row.course_code}-${row.academic_year}`}>
              <Table.Td>{row.course_code}</Table.Td>
              <Table.Td>{row.course_name}</Table.Td>
              <Table.Td>{row.credits}</Table.Td>
              <Table.Td>{row.letter_grade}</Table.Td>
              <Table.Td>{row.grade_points}</Table.Td>
              <Table.Td>
                <Badge
                  variant="light"
                  color={row.is_verified ? "green" : "yellow"}
                >
                  {row.is_verified ? "Verified" : "Pending"}
                </Badge>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </ScrollArea>
  );
}

ResultTable.propTypes = {
  rows: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};
