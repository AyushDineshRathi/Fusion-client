import PropTypes from "prop-types";
import { Badge, ScrollArea, Table } from "@mantine/core";

export default function GradeTable({ rows }) {
  return (
    <ScrollArea>
      <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Roll No</Table.Th>
            <Table.Th>Name</Table.Th>
            <Table.Th>Grade</Table.Th>
            <Table.Th>Points</Table.Th>
            <Table.Th>Status</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {rows.map((row) => (
            <Table.Tr key={`${row.roll_no}-${row.letter_grade}`}>
              <Table.Td>{row.roll_no}</Table.Td>
              <Table.Td>{row.student_name}</Table.Td>
              <Table.Td>{row.letter_grade}</Table.Td>
              <Table.Td>{row.grade_points}</Table.Td>
              <Table.Td>
                <Badge
                  color={row.is_verified ? "green" : "orange"}
                  variant="light"
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

GradeTable.propTypes = {
  rows: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};
