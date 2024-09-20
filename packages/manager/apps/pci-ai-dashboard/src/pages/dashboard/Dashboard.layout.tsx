import { Outlet, useParams } from 'react-router-dom';
import { DashboardHeader } from './_components/DashboardHeader.component';
import DashboardTabs from './_components/DashboardTabs.component';
import { useGetNotebooks } from '@/hooks/api/ai/notebook/useGetNotebooks.hook';
import { useGetJobs } from '@/hooks/api/ai/job/useGetJobs.hook';
import { useGetApps } from '@/hooks/api/ai/app/useGetApps.hook';
import { POLLING } from '@/configuration/polling';
import { DashboardLayoutContext } from './Dashboard.context';
import { useUserActivityContext } from '@/contexts/UserActivity.context';

export default function DashboardLayout() {
  const { projectId } = useParams();
  const { isUserActive } = useUserActivityContext();
  const notebooksQuery = useGetNotebooks(projectId, {
    refetchInterval: isUserActive && POLLING.NOTEBOOKS,
  });
  const jobsQuery = useGetJobs(projectId, {
    refetchInterval: isUserActive && POLLING.JOBS,
  });
  const appsQuery = useGetApps(projectId, {
    refetchInterval: isUserActive && POLLING.APPS,
  });

  if (
    !notebooksQuery.isSuccess ||
    !jobsQuery.isSuccess ||
    !appsQuery.isSuccess
  ) {
    return <DashboardHeader.Skeleton />;
  }

  const notebooks = notebooksQuery.data;
  const jobs = jobsQuery.data;
  const apps = appsQuery.data;

  const dashboardTabs =
    notebooksQuery.isSuccess &&
    jobsQuery.isSuccess &&
    appsQuery.isSuccess &&
    (notebooks.length > 0 || jobs.length > 0 || apps?.length > 0) ? (
      <DashboardTabs />
    ) : (
      <></>
    );

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
