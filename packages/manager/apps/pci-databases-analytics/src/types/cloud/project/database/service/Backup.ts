import { Time } from '@/types/Time';

/** Cloud database service backups definition */
export interface Backup {
  /** Date until PITR is available */
  pitr?: string;
  /** Regions on which the backups are stored */
  regions: string[];
  /** Number of retention days for the backups */
  retentionDays?: number;
  /** Time on which backups start every day */
  time: Time;
}
