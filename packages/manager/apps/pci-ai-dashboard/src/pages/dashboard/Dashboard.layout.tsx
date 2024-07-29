import { Outlet, useParams } from 'react-router-dom';
import { DashboardHeader } from './_components/DashboardHeader.component';
import DashboardTabs from './_components/DashboardTabs.component';
import { useGetNotebooks } from '@/hooks/api/ai/notebook/useGetNotebooks.hook';
import { useGetJobs } from '@/hooks/api/ai/job/useGetJobs.hook';
import { useGetApps } from '@/hooks/api/ai/app/useGetApps.hook';
import { POLLING } from '@/configuration/polling';
import { DashboardLayoutContext } from './Dashboard.context';

export default function DashboardLayout() {
  const { projectId } = useParams();
  const notebooksQuery = useGetNotebooks(projectId, {
    refetchInterval: POLLING.NOTEBOOKS,
  });
  const jobsQuery = useGetJobs(projectId, {
    refetchInterval: POLLING.JOBS,
  });
  const appsQuery = useGetApps(projectId, {
    refetchInterval: POLLING.APPS,
  });

  const notebooks = notebooksQuery.data;
  const jobs = jobsQuery.data;
  const apps = appsQuery.data;

  if (
    !notebooksQuery.isSuccess &&
    !jobsQuery.isSuccess &&
    !appsQuery.isSuccess
  ) {
    return (
      <>
        <DashboardHeader.Skeleton />
      </>
    );
  }
  const dashboardTabs = notebooks || jobs || apps ? <DashboardTabs /> : <></>;

  const dashboardLayoutContext: DashboardLayoutContext = {
    notebooks,
    jobs,
    apps,
  };

  return (
    <>
      <DashboardHeader />
      {dashboardTabs}
      <div className="space-y-2">
        <Outlet context={dashboardLayoutContext} />
      </div>
    </>
  );
}
