import { Outlet, redirect, useParams } from 'react-router-dom';
import { Skeleton } from '@datatr-ux/uxlib';
import { POLLING } from '@/configuration/polling.constants';
import queryClient from '@/query.client';
import { useUserActivityContext } from '@/contexts/UserActivityContext';
import { getJob } from '@/data/api/ai/job/job.api';
import { JobLayoutContext } from './Job.context';
import { JobHeader } from './_components/JobHeader.component';
import TabsMenu from '@/components/tabs-menu/TabsMenu.component';
import JobTabs from './_components/JobTabs.component';
import { useGetJob } from '@/data/hooks/ai/job/useGetJob.hook';

interface JobLayoutProps {
  params: {
    projectId: string;
    jobId: string;
  };
  request: Request;
}
// try to fetch the service data, redirect to service page if it fails
export const Loader = async ({ params }: JobLayoutProps) => {
  const { projectId, jobId } = params;
  return queryClient
    .fetchQuery({
      queryKey: [projectId, 'ai/job', jobId],
      queryFn: () => getJob({ projectId, jobId }),
    })
    .then(
      () => null,
      () => redirect(`/pci/projects/${projectId}/ai/notebooks/training`),
    );
};

function JobName() {
  const { projectId, jobId } = useParams();
  if (!jobId) return '';
  const jobQuery = useGetJob(projectId, jobId);
  return jobQuery.isSuccess ? (
    jobQuery.data.spec.name
  ) : (
    <Skeleton className="h-4 w-20 inline-block align-middle" />
  );
}

export function breadcrumb() {
  return <JobName />;
}

export default function JobLayout() {
  const { isUserActive } = useUserActivityContext();
  const { projectId, jobId } = useParams();
  const jobQuery = useGetJob(projectId, jobId, {
    refetchInterval: isUserActive && POLLING.JOB,
  });

  const job = jobQuery.data;
  if (!job) {
    return (
      <>
        <JobHeader.Skeleton />
        <TabsMenu.Skeleton />
      </>
    );
  }
  const jobLayoutContext: JobLayoutContext = {
    job,
    jobQuery,
  };

  return (
    <>
      <JobHeader job={job} />
      <JobTabs job={job} />
      <div className="space-y-2">
        <Outlet context={jobLayoutContext} />
      </div>
    </>
  );
}
