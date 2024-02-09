import { Outlet } from 'react-router-dom';
import { useRequiredParams } from '@/hooks/useRequiredParams';

import TabsMenu from '@/components/tabs-menu';
import { H2 } from '@/components/typography';

import { useGetJob } from '@/hooks/api/jobs/useGetJob';
export const Handle = {
  breadcrumb: (params: { jobId: string }) => params.jobId,
};

export default function JobLayout() {
  const { projectId, jobId } = useRequiredParams<{
    projectId: string;
    jobId: string;
  }>();
  const jobQuery = useGetJob(projectId, jobId, {
    refetchInterval: 30_000,
  });
  const tabs = [
    { href: 'general-information', label: 'General information' },
    { href: 'logs', label: 'Logs' },
    { href: 'attached-data', label: 'Attached data' },
  ];
  return (
    <>
      <H2>{jobQuery.data?.spec.name ?? 'General information'}</H2>
      <p>{jobQuery.data?.id ?? 'General information'}</p>
      <TabsMenu tabs={tabs} />
      <Outlet context={jobQuery} />
    </>
  );
}
