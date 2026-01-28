/** Cloud database clickhouse single query statistic definition */
export interface Query {
  /** Number of times this function has been called */
  calls: number
  /** Name of the database */
  database: string
  /** Maximum time spent for the statement, in milliseconds */
  maxTime: number
  /** Mean time spent for the statement, in milliseconds */
  meanTime: number
  /** Minimum time spent for the statement, in milliseconds */
  minTime: number
  /** 95th percentile time spent for the statement, in milliseconds */
  p95Time: number
  /** Text of a representative statement */
  query: string
  /** Total number of rows retrieved or affected by the statement */
  rows: number
  /** Population standard deviation of time spent for the statement, in milliseconds */
  stddevTime: number
  /** Total time spent for the statement, in milliseconds */
  totalTime: number
  }
