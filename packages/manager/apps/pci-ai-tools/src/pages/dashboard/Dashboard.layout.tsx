import { Outlet, useParams } from 'react-router-dom';
import { DashboardHeader } from './_components/DashboardHeader.component';
import DashboardTabs from './_components/DashboardTabs.component';

import { DashboardLayoutContext } from './Dashboard.context';
import { useUserActivityContext } from '@/contexts/UserActivityContext';
import { POLLING } from '@/configuration/polling.constants';
import { useGetNotebooks } from '@/data/hooks/ai/notebook/useGetNotebooks.hook';
import { useGetJobs } from '@/data/hooks/ai/job/useGetJobs.hook';
import { useGetApps } from '@/data/hooks/ai/app/useGetApps.hook';

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

  const dashboardLayoutContext: DashboardLayoutContext = {
    notebooks,
    jobs,
    apps,
  };

  return (
    <>
      <DashboardHeader />
      <DashboardTabs />
      <div className="space-y-2">
        <Outlet context={dashboardLayoutContext} />
      </div>
    </>
  );
}
