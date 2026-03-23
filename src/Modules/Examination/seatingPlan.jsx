import { useMutation, useQuery } from "@tanstack/react-query";
import { Alert, Card, Stack, Table, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import {
  fetchAcadAdminOptions,
  fetchSeatingPlans,
  generateSeatingPlan,
} from "./api";
import SeatingPlanForm from "./components/SeatingPlanForm";

export default function SeatingPlan() {
  const [selectedAcademicYear, setSelectedAcademicYear] = useState("");
  const optionsQuery = useQuery({
    queryKey: ["acad-admin-options"],
    queryFn: fetchAcadAdminOptions,
  });
  useEffect(() => {
    if (!selectedAcademicYear && optionsQuery.data?.academic_years?.length) {
      setSelectedAcademicYear(optionsQuery.data.academic_years[0]);
    }
  }, [optionsQuery.data, selectedAcademicYear]);

  const plansQuery = useQuery({
    queryKey: ["seating-plans", selectedAcademicYear],
    queryFn: () => fetchSeatingPlans({ academicYear: selectedAcademicYear }),
    enabled: Boolean(selectedAcademicYear),
  });

  const generateMutation = useMutation({
    mutationFn: generateSeatingPlan,
    onSuccess: () =>
      notifications.show({
        color: "green",
        message: "Seating plan generated.",
      }),
    onError: () =>
      notifications.show({
        color: "red",
        message: "Failed to generate seating plan.",
      }),
  });

  return (
    <Stack gap="lg">
      <SeatingPlanForm
        academicYearOptions={(optionsQuery.data?.academic_years || []).map((year) => ({
          value: year,
          label: year,
        }))}
        courseOptions={(optionsQuery.data?.courses || []).map((course) => ({
          value: String(course.id),
          label: `${course.code} - ${course.name}`,
        }))}
        semesterOptions={(optionsQuery.data?.semesters || []).map((semester) => ({
          value: String(semester.id),
          label: `Semester ${semester.semester_no}`,
        }))}
        onSubmit={(payload) => {
          setSelectedAcademicYear(payload.academic_year);
          generateMutation.mutate(payload);
        }}
        busy={generateMutation.isPending}
      />
      <Card withBorder radius="md">
        <Stack>
          <Text fw={700}>Generated Seating Plans</Text>
          {plansQuery.isLoading && (
            <Alert color="blue">Loading seating plans...</Alert>
          )}
          {plansQuery.data?.length ? (
            <Table withTableBorder>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Exam</Table.Th>
                  <Table.Th>Hall</Table.Th>
                  <Table.Th>Seat Range</Table.Th>
                  <Table.Th>Date</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {plansQuery.data.map((plan) => (
                  <Table.Tr key={plan.id}>
                    <Table.Td>{plan.exam_name}</Table.Td>
                    <Table.Td>{plan.hall_name}</Table.Td>
                    <Table.Td>
                      {plan.seat_start} - {plan.seat_end}
                    </Table.Td>
                    <Table.Td>{plan.exam_date}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          ) : (
            <Alert color="gray">No seating plans generated yet.</Alert>
          )}
          {plansQuery.isError && (
            <Alert color="red">Unable to load seating plans.</Alert>
          )}
        </Stack>
      </Card>
      {optionsQuery.isError && (
        <Alert color="red">Unable to load course/semester options.</Alert>
      )}
      {optionsQuery.isLoading && (
        <Alert color="blue">Loading seating plan options...</Alert>
      )}
    </Stack>
  );
}
