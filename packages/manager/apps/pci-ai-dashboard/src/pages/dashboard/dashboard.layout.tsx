import { Outlet, useOutletContext, useParams } from 'react-router-dom';
import { DashboardHeader } from './_components/dashboardHeader.component';
import DashboardTabs from './_components/dashboardTabs.component';
import { useGetNotebooks } from '@/hooks/api/notebook-api/useGetNotebooks';
import { useGetJobs } from '@/hooks/api/job-api/useGetJobs';
import { useGetApps } from '@/hooks/api/app-api/useGetApps';
import { ai } from '@/types/ai';
import { POLLING } from '@/configuration/polling';

type DashboardLayoutContext = {
  notebooks: ai.notebook.Notebook[];
  jobs: ai.job.Job[];
  apps: ai.app.App[];
};

export function useDashboardData() {
  const { projectId } = useParams();
  const {
    notebooks,
    jobs,
    apps,
  } = useOutletContext() as DashboardLayoutContext;
  return { projectId, notebooks, jobs, apps };
}

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
