import { database } from '@/interfaces/database';

export const mockedQueries: database.service.currentqueries.Query = {
  applicationName: 'applicationName',
  backendStart: 'backendStart',
  backendType: 'backendType',
  backendXid: 3,
  backendXmin: 1,
  clientHostname: 'clientHostname',
  clientIp: 'clientIp',
  clientPort: 8080,
  databaseId: 12,
  databaseName: 'databaseName',
  leaderPid: 1,
  pid: 2,
  query: 'query',
  queryDuration: 3,
  queryStart: 'queryStart',
  state: database.service.currentqueries.StateEnum.ACTIVE,
  stateChange: 'stateChange',
  transactionStart: 'transactionStart',
  userId: 3,
  userName: 'userName',
  waitEvent: 'waitEvent',
  waitEventType: database.service.currentqueries.WaitEventTypeEnum.BUFFER_PIN,
};

export const mockedQueryStatistics: database.mysql.querystatistics.Query = {
  avgTimerWait: 3,
  countStar: 3,
  digest: 'digest',
  digestText: 'digestText',
  firstSeen: 'firstSeen',
  lastSeen: 'lastSeen',
  maxTimerWait: 3,
  minTimerWait: 3,
  quantile95: 3,
  quantile99: 1,
  quantile999: 78987,
  querySampleSeen: 'querySampleSeen',
  querySampleText: 'querySampleText',
  querySampleTimerWait: 3,
  schemaName: 'schemaName',
  sumCreatedTmpDiskTables: 3,
  sumCreatedTmpTables: 3,
  sumErrors: 3,
  sumLockTime: 3,
  sumNoGoodIndexUsed: 3,
  sumNoIndexUsed: 3,
  sumRowsAffected: 3,
  sumRowsExamined: 3,
  sumRowsSent: 3,
  sumSelectFullJoin: 3,
  sumSelectFullRangeJoin: 3,
  sumSelectRange: 3,
  sumSelectRangeCheck: 3,
  sumSelectScan: 3,
  sumSortMergePasses: 3,
  sumSortRange: 3,
  sumSortRows: 3,
  sumSortScan: 3,
  sumTimerWait: 3,
  sumWarnings: 3,
};

export const mockedQueryStatisticsPG: database.postgresql.querystatistics.Query = {
  blkReadTime: 2,
  blkWriteTime: 2,
  /** Number of times this function has been called */
  calls: 2,
  /** Name of the database */
  databaseName: 'databaseName',
  /** Total number of local blocks dirtied by the statement */
  localBlksDirtied: 2,
  /** Total number of local block cache hits by the statement */
  localBlksHit: 2,
  /** Total number of local blocks read by the statement */
  localBlksRead: 2,
  /** Total number of local blocks written by the statement */
  localBlksWritten: 2,
  /** Maximum time spent planning the statement, in milliseconds */
  maxPlanTime: 2,
  /** Maximum time spent for the statement, in milliseconds */
  maxTime: 2,
  /** Mean time spent planning the statement, in milliseconds */
  meanPlanTime: 2,
  /** Mean time spent for the statement, in milliseconds */
  meanTime: 2,
  /** Minimum time spent planning the statement, in milliseconds */
  minPlanTime: 2,
  /** Minimum time spent for the statement, in milliseconds */
  minTime: 2,
  /** Text of a representative statement */
  query: 'query',
  /** Total number of rows retrieved or affected by the statement */
  rows: 2,
  /** Total number of shared blocks dirtied by the statement */
  sharedBlksDirtied: 2,
  /** Total number of shared block cache hits by the statement */
  sharedBlksHit: 2,
  /** Total number of shared blocks read by the statement */
  sharedBlksRead: 2,
  /** Total number of shared blocks written by the statement */
  sharedBlksWritten: 2,
  /** Population standard deviation of time spent planning the statement, in milliseconds */
  stddevPlanTime: 2,
  /** Population standard deviation of time spent for the statement, in milliseconds */
  stddevTime: 2,
  /** Total number of temp blocks read by the statement */
  tempBlksRead: 2,
  /** Total number of temp blocks written by the statement */
  tempBlksWritten: 2,
  /** Total time spent planning the statement, in milliseconds */
  totalPlanTime: 2,
  /** Total time spent for the statement, in milliseconds */
  totalTime: 2,
  /** Name of the user who executed the statement */
  username: 'username',
  /** Total amount of WAL generated by the statement in bytes */
  walBytes: {
    unit: 'walBytes',
    value: 2,
  },
  /** Total number of WAL full page images generated by the statement */
  walFpi: 2,
  /** Total number of WAL records generated by the statement */
  walRecords: 2,
};
