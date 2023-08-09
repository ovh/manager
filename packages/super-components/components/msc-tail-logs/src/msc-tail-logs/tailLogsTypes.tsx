export enum SortOrder {
  Ascending = 'asc',
  Descending = 'desc',
}

export interface LogEntry {
  [key: string]: any;
}

export function getColorType(message: string): string {
  if (
    /warning/i.test(message) ||
    /status\s*>=\s*300\s*&&\s*status\s*<\s*499/i.test(message)
  ) {
    return 'warning';
  }
  if (/crit|alert|emerg/i.test(message) || /status\s*> 499/i.test(message)) {
    return 'error';
  }
  if (/debug/i.test(message)) {
    return 'default';
  }
  return '';
}
