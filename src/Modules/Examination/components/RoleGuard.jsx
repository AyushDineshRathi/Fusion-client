import PropTypes from "prop-types";
import { Alert } from "@mantine/core";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { normalizeRole } from "./roleUtils";

export default function RoleGuard({ roles, children }) {
  const role = normalizeRole(useSelector((state) => state.user.role));

  if (!role || role === "guest-user") {
    return <Alert color="yellow">Loading role information...</Alert>;
  }

  if (!roles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

RoleGuard.propTypes = {
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
  children: PropTypes.node.isRequired,
};
