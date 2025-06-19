import { Outlet, useParams } from 'react-router-dom';
import { DashboardHeader } from './_components/DashboardHeader.component';
import DashboardTabs from './_components/DashboardTabs.component';
import { DashboardLayoutContext } from './Dashboard.context';
import { useUserActivityContext } from '@/contexts/UserActivityContext';
import { POLLING } from '@/configuration/polling.constants';
import { useGetNotebooks } from '@/data/hooks/ai/notebook/useGetNotebooks.hook';
import { useGetJobs } from '@/data/hooks/ai/job/useGetJobs.hook';
import { useGetApps } from '@/data/hooks/ai/app/useGetApps.hook';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';
import { useGetFramework } from '@/data/hooks/ai/capabilities/useGetFramework.hook';
import { useQuantum } from '@/hooks/useQuantum.hook';

function ManageBreadcrumb() {
  const { isQuantum } = useQuantum('');

  const translationKey = isQuantum
    ? 'crumb-quantum-dashboard'
    : 'crumb-dashboard';
  return (
    <BreadcrumbItem translationKey={translationKey} namespace="ai-tools" />
  );
}

export function breadcrumb() {
  return <ManageBreadcrumb />;
}

export default function DashboardLayout() {
  const { projectId } = useParams();
  const { isQuantum } = useQuantum();
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
  const frameworkQuery = useGetFramework(projectId, 'GRA');

  if (
    !notebooksQuery.isSuccess ||
    !jobsQuery.isSuccess ||
    !appsQuery.isSuccess ||
    !frameworkQuery.isSuccess
  ) {
    return <DashboardHeader.Skeleton />;
  }

  const filterFmkIds = frameworkQuery.data
    .filter((fmk) => (isQuantum ? fmk.type === 'Quantum' : fmk.type === 'AI'))
    .map((fwk) => fwk.id);

  const notebooks = notebooksQuery.data.filter((nb) =>
    filterFmkIds.includes(nb.spec.env.frameworkId),
  );
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
