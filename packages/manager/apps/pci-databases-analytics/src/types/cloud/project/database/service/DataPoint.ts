/** A single value from a metric */
export interface DataPoint {
  /** Timestamp in seconds since epoch time */
  timestamp?: number;
  /** Value of this datapoint */
  value?: number;
}
