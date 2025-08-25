export const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  const hours = date
    .getHours()
    .toString()
    .padStart(2, '0');
  const minutes = date
    .getMinutes()
    .toString()
    .padStart(2, '0');
  const seconds = date
    .getSeconds()
    .toString()
    .padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`; // HH:MM:SS
};

// Formatter registry for dynamic formatter selection
export const formatters = {
  formatTimestamp,
  // Add more formatters here as needed
};

// Helper function to get formatter by name
export const getFormatter = (formatterName?: string) => {
  if (!formatterName || !(formatterName in formatters)) {
    return undefined; // TODO: define a Default formatter
  }
  return formatters[formatterName as keyof typeof formatters];
};
