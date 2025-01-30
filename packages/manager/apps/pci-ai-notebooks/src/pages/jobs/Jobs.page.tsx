import { useTranslation } from 'react-i18next';
import { useParams, Outlet } from 'react-router-dom';
import { POLLING } from '@/configuration/polling.constants';
import { useUserActivityContext } from '@/contexts/UserActivityContext';
import Guides from '@/components/guides/Guides.component';

import { allGuidesSections } from '@/configuration/guide';
import JobsList from './_components/JobsListTable.component';
import { useGetJobs } from '@/hooks/api/ai/job/useGetJobs.hook';

const Jobs = () => {
  const { t } = useTranslation('pci-ai-training/jobs');
  const { projectId } = useParams();
  const { isUserActive } = useUserActivityContext();
  const jobQuery = useGetJobs(projectId, {
    refetchInterval: isUserActive && POLLING.JOBS,
  });

  if (jobQuery.isLoading) return <JobsList.Skeleton />;
  return (
    <>
      <div
        data-testid="jobs-guides-container"
        className="flex justify-between w-full items-center"
      >
        <h2>{t('title')}</h2>
        <Guides section={allGuidesSections} />
      </div>
      <JobsList jobs={jobQuery.data} />
      <Outlet />
    </>
  );
};

export default Jobs;
