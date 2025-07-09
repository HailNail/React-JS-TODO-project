//

export function removeSpecialChars(val) {
  return val.trim().replace(/[^A-Za-z0-9\-\s]/g, "");
}
export const formatDate = (date) => {
  const d = new Date(date);
  return d.toISOString().split("T")[0]; // Returns date in YYYY-MM-DD format
};

export const formatDateForDisplay = (dateStr) => {
  const [year, month, day] = dateStr.split("-");
  return `${day}-${month}-${year}`;
};
