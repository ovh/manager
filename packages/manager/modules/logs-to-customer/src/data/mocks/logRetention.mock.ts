import { ClusterRetention, RetentionTypeEnum } from '../types/dbaas/logs';

export const logRetentionsMock: ClusterRetention[] = [
  {
    isSupported: true,
    retentionId: 'id1',
    retentionType: RetentionTypeEnum.LOGS_COLD_STORAGE,
    duration: 'P1M',
  },
  {
    isSupported: true,
    retentionId: 'id2',
    retentionType: RetentionTypeEnum.LOGS_COLD_STORAGE,
    duration: 'P3M',
  },
];
