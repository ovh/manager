import { format } from 'date-fns';

export const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  return format(date, 'HH:mm:ss');
};

export const formatTimestampToDateTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  return format(date, "PPPP p");
};

export const formatLargeNumber = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
  }).format(value)
};

// Formatter registry for dynamic formatter selection
export const formatters = {
  formatTimestamp,
  formatLargeNumber,
  formatTimestampToDateTime,
  // Add more formatters here as needed
};

// Helper function to get formatter by name
export const getFormatter = (formatterName?: string) => {
  if (!formatterName || !(formatterName in formatters)) {
    return undefined; // TODO: define a Default formatter
  }
  return formatters[formatterName as keyof typeof formatters];
};
