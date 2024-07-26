/** Backups availability of databases engines on cloud projects */
export interface Backups {
  /** Defines whether the backups are available for this offer */
  available?: boolean;
  /** Number of retention days for the backups */
  retentionDays?: number;
}
