import { JobStateEnum } from '@/types/cloud/project/ai/job/JobStateEnum';

/** AI Solutions Job Status History Object */
export interface JobStatusHistory {
  /** Date when the status occurred */
  date?: string;
  /** State of the job */
  state?: JobStateEnum;
}
