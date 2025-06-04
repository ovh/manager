import { useTranslation } from 'react-i18next';
import { useParams, Outlet, redirect } from 'react-router-dom';
import { POLLING } from '@/configuration/polling.constants';
import { useUserActivityContext } from '@/contexts/UserActivityContext';
import Guides from '@/components/guides/Guides.component';
import { jobGuidesSections } from '@/configuration/guide';
import JobsList from './_components/JobsListTable.component';
import { useGetJobs } from '@/data/hooks/ai/job/useGetJobs.hook';
import queryClient from '@/query.client';
import { getJobs } from '@/data/api/ai/job/job.api';
import RoadmapChangelog from '@/components/roadmap-changelog/RoadmapChangelog.component';
import { JobsRoadmapLinks } from '@/configuration/roadmap-changelog.constants';

interface JobsProps {
  params: {
    projectId: string;
  };
  request: Request;
}

export const Loader = async ({ params }: JobsProps) => {
  const { projectId } = params;
  const jobs = await queryClient.fetchQuery({
    queryKey: [projectId, 'ai', 'job'],
    queryFn: () => getJobs({ projectId }),
  });
  if (jobs.length === 0) {
    return redirect(`/pci/projects/${projectId}/ai-ml/training/onboarding`);
  }
  return null;
};

const Jobs = () => {
  const { t } = useTranslation('ai-tools/jobs');
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
        <div className="flex flex-wrap justify-end gap-1">
          <RoadmapChangelog links={JobsRoadmapLinks} />
          <Guides section={jobGuidesSections} />
        </div>
      </div>
      <JobsList jobs={jobQuery.data} />
      <Outlet />
    </>
  );
};

export default Jobs;
