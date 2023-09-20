export type SortOrder = 'asc' | 'desc';

export type LogEntry = {
  timestamp?: number;
  message: string;
  [key: string]: string | number | undefined;
};
