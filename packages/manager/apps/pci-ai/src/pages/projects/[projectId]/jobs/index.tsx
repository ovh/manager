import { useEffect, useState } from 'react';
import { useRequiredParams } from '@/hooks/useRequiredParams';

import { ai } from '@/models/types';
import Onboarding from './_components/onboarding';
import JobsList from './_components/jobsListTable';
import { useGetJobs } from '@/hooks/api/jobs/useGetJobs';


export default function JobsPage() {
  const [jobs, setJobs] = useState<ai.job.Job[]>([]);
  const { projectId } = useRequiredParams<{ projectId: string }>();

  const jobsQuery = useGetJobs(projectId, {
    refetchInterval: 30_000,
  });

  if (jobsQuery.error)
    return <pre>{JSON.stringify(jobsQuery.error)}</pre>;

  useEffect(() => {
    if (!jobsQuery.data) return;
    setJobs(jobsQuery.data);
  });

  if (jobsQuery.isLoading) return <JobsList.Skeleton />;

  const refetch = () => {
    jobsQuery.refetch();
  };

  return (
    <>
      {jobs.length > 0 ? (
        <JobsList
          jobs={jobs}
          projectId={projectId}
          refetchFn={refetch}
        />
      ) : (
        <Onboarding />
      )}
      </>
  );
}
