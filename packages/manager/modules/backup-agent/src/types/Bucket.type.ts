import { ResourceStatus } from '@/types/Resource.type';

export type BucketPerformance = 'HIGHPERF' | 'STANDARD';

export type BucketRole = 'PRIMARY' | 'REPLICATED';

export type Bucket = {
  id: string;
  name: string;
  performance: BucketPerformance;
  region: string;
  role: BucketRole;
  status: ResourceStatus;
};
