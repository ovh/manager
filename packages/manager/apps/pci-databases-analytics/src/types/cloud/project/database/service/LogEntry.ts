/** A single log entry */
export interface LogEntry {
  /** Host from which the log is coming from */
  hostname?: string;
  /** The log message */
  message?: string;
  /** Timestamp in seconds since epoch time */
  timestamp?: number;
}
