/** Cloud database mysql single query statistic definition */
export interface Query {
  /** Average wait time of the summarized timed events, in milliseconds */
  avgTimerWait?: number;
  /** Number of summarized events. This value includes all events, whether timed or nontimed */
  countStar?: number;
  /** Digest of the summarized events */
  digest?: string;
  /** Text of the summarized digest events */
  digestText?: string;
  /** First appearance of the events */
  firstSeen?: string;
  /** Last appearance of the events */
  lastSeen?: string;
  /** Maximum wait time of the summarized timed events, in milliseconds */
  maxTimerWait?: number;
  /** Mininum wait time of the summarized timed events, in milliseconds */
  minTimerWait?: number;
  /** 95th percentile of the statement latency, in picoseconds */
  quantile95?: number;
  /** 99th percentile of the statement latency, in picoseconds */
  quantile99?: number;
  /** 99.9th percentile of the statement latency, in picoseconds */
  quantile999?: number;
  /** Datetime when the querySampleText column was seen */
  querySampleSeen?: string;
  /** Sample SQL statement that produces the digest value in the row */
  querySampleText?: string;
  /** Wait time for the sample statement in the querySampleText column, in milliseconds */
  querySampleTimerWait?: number;
  /** SchemaName of the summarized events */
  schemaName?: string;
  /** Number of internal on-disk temporary tables created */
  sumCreatedTmpDiskTables?: number;
  /** Number of internal temporary tables created */
  sumCreatedTmpTables?: number;
  /** Number of errors */
  sumErrors?: number;
  /** Sum of lock time of the summarized timed events, in milliseconds */
  sumLockTime?: number;
  /** Sum of not good indexes of the summarized timed events */
  sumNoGoodIndexUsed?: number;
  /** Sum of no indexes of the summarized timed events */
  sumNoIndexUsed?: number;
  /** Sum of rows affected of the summarized timed events */
  sumRowsAffected?: number;
  /** Sum of rows examined of the summarized timed events */
  sumRowsExamined?: number;
  /** Sum of rows sent of the summarized timed events */
  sumRowsSent?: number;
  /** Sum of select full join of the summarized timed events */
  sumSelectFullJoin?: number;
  /** Sum of select full range join of the summarized timed events */
  sumSelectFullRangeJoin?: number;
  /** Sum of select range of the summarized timed events */
  sumSelectRange?: number;
  /** Sum of select range check of the summarized timed events */
  sumSelectRangeCheck?: number;
  /** Sum of select scan of the summarized timed events */
  sumSelectScan?: number;
  /** Sum of sorted merge passes of the summarized timed events */
  sumSortMergePasses?: number;
  /** Sum of sorted range of the summarized timed events */
  sumSortRange?: number;
  /** Sum of sorted rows of the summarized timed events */
  sumSortRows?: number;
  /** Sum of sort scan of the summarized timed events */
  sumSortScan?: number;
  /** Sum of wait time of the summarized timed events, in milliseconds */
  sumTimerWait?: number;
  /** Number of warnings */
  sumWarnings?: number;
}
