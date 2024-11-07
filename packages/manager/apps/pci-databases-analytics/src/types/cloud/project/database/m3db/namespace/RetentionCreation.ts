/** M3db namespace retention definition */
export interface RetentionCreation {
  /** Controls how long we wait before expiring stale data */
  blockDataExpirationDuration?: string;
  /** Controls how long to keep a block in memory before flushing to a fileset on disk */
  blockSizeDuration?: string;
  /** Controls how far into the future writes to the namespace will be accepted */
  bufferFutureDuration?: string;
  /** Controls how far into the past writes to the namespace will be accepted */
  bufferPastDuration?: string;
  /** Controls the duration of time that M3DB will retain data for the namespace */
  periodDuration: string;
}
