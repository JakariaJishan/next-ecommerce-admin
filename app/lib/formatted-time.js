export const FormatTime = (time) => {
  if (!time) return null;
  return new Date(`${time}`).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // Ensure 12-hour format with AM/PM
  });
}