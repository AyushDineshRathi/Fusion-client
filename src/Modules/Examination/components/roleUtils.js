export function normalizeRole(role) {
  const value = String(role || "")
    .trim()
    .toLowerCase();
  if (!value) {
    return "";
  }
  if (
    [
      "assistant professor",
      "associate professor",
      "professor",
      "faculty",
    ].includes(value)
  ) {
    return "faculty";
  }
  if (["dean", "dean academic"].includes(value)) {
    return "dean";
  }
  if (["academic admin", "acadadmin"].includes(value)) {
    return "acadadmin";
  }
  if (value === "superuser") {
    return "superuser";
  }
  if (value === "student") {
    return "student";
  }
  return value;
}
