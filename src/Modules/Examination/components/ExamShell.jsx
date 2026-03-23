import PropTypes from "prop-types";
import {
  AppShell,
  Badge,
  Container,
  Group,
  Stack,
  Tabs,
  Text,
  Title,
} from "@mantine/core";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { examinationNavItems } from "../../../routes/examinationRoutes";
import { normalizeRole } from "./roleUtils";

export default function ExamShell({ children }) {
  const role = normalizeRole(useSelector((state) => state.user.role));
  const location = useLocation();
  const visibleItems = examinationNavItems.filter(
    (item) => !item.roles || item.roles.includes(role),
  );

  return (
    <AppShell padding="md">
      <AppShell.Main>
        <Container size="xl">
          <Stack gap="lg">
            <Group justify="space-between" align="flex-end">
              <div>
                <Title order={2}>Examination Module</Title>
                <Text c="dimmed">
                  Clean workflow for submission, verification, publication, and
                  transcripts.
                </Text>
              </div>
              <Badge color="blue" variant="light">
                {role}
              </Badge>
            </Group>
            <Tabs value={location.pathname}>
              <Tabs.List>
                {visibleItems.map((item) => (
                  <Tabs.Tab
                    key={item.path}
                    value={item.path}
                    component={Link}
                    to={item.path}
                  >
                    {item.label}
                  </Tabs.Tab>
                ))}
              </Tabs.List>
            </Tabs>
            {children}
          </Stack>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}

ExamShell.propTypes = {
  children: PropTypes.node.isRequired,
};
