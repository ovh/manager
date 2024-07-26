/** Cloud database kafka topic definition */
export interface Topic {
  /** Topic ID */
  id?: string;
  /** Minimum insync replica accepted for this topic */
  minInsyncReplicas: number;
  /** Name of the topic */
  name?: string;
  /** Number of partitions for this topic */
  partitions: number;
  /** Number of replication for this topic */
  replication: number;
  /** Number of bytes for the retention of the data for this topic */
  retentionBytes: number;
  /** Number of hours for the retention of the data for this topic */
  retentionHours: number;
}
