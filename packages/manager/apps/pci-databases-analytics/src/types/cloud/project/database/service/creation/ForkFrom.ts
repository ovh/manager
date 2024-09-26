/** Defines the source to fork a cluster from a backup */
export interface ForkFrom {
  /** Backup ID (not compatible with pointInTime) */
  backupId?: string;
  /** Point in time to restore from (not compatible with id) */
  pointInTime?: string;
  /** Service ID to which the backups belong to */
  serviceId: string;
}
