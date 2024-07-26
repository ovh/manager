/** Defines the source to fork a cluster from a backup. DEPRECATED: use forkFrom */
export interface BackupFork {
  /** Backup ID (not compatible with pointInTime) */
  id: string;
  /** Point in time to restore from (not compatible with id) */
  pointInTime: string;
  /** Service ID to which the backups belong to */
  serviceId: string;
}
