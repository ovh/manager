import { UseQueryResult } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import * as ai from '@/types/cloud/project/ai';
import { useGetJob } from '@/hooks/api/ai/job/useGetJob.hook';

// Share data with the child routes
export type JobLayoutContext = {
  job: ai.job.Job;
  jobQuery: UseQueryResult<ai.job.Job, Error>;
};
export const useJobData = () => {
  const { projectId, jobId } = useParams();
  const jobQuery = useGetJob(projectId, jobId);
  return { projectId, job: jobQuery.data, jobQuery };
};
