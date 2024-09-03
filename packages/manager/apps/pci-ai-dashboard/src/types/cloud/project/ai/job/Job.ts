import { JobSpec } from '@/types/cloud/project/ai/job/JobSpec';
import { JobStatus } from '@/types/cloud/project/ai/job/JobStatus';

/** AI Solutions Job Object */
export interface Job {
  /** Job creation date */
  createdAt?: string;
  /** Job Id */
  id?: string;
  /** Job specifications */
  spec?: JobSpec;
  /** Job status */
  status?: JobStatus;
  /** Job update date */
  updatedAt?: string;
  /** Job user owner */
  user?: string;
}
