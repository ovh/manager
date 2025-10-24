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
import { useGetRegions } from '@/data/hooks/ai/capabilities/useGetRegions.hook';

export function breadcrumb() {
  return (
    <BreadcrumbItem translationKey="crumb-dashboard" namespace="ai-tools" />
  );
}

export default function DashboardLayout() {
  const { projectId } = useParams();
  const { isUserActive } = useUserActivityContext();
  const regionQuery = useGetRegions(projectId);
  const notebooksQuery = useGetNotebooks(projectId, {
    refetchInterval: isUserActive && POLLING.NOTEBOOKS,
  });
  const jobsQuery = useGetJobs(projectId, {
    refetchInterval: isUserActive && POLLING.JOBS,
  });
  const appsQuery = useGetApps(projectId, {
    refetchInterval: isUserActive && POLLING.APPS,
  });
  const regionId = regionQuery?.data?.length > 0 && regionQuery?.data[0]?.id;

  const frameworkQuery = useGetFramework(projectId, regionId, '', {
    enabled: !!regionId,
  });

  if (
    !notebooksQuery.isSuccess ||
    !jobsQuery.isSuccess ||
    !appsQuery.isSuccess ||
    !frameworkQuery.isSuccess
  ) {
    return <DashboardHeader.Skeleton />;
  }

  const filterFmkIds = frameworkQuery.data
    .filter((fmk) => fmk.type === 'AI')
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
