import { Outlet, redirect, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUserActivityContext } from '@/contexts/UserActivityContext';
import RoadmapChangelog from '@/components/roadmap-changelog/RoadmapChangelog.component';
import QpusList from './_components/QpusListTable.component';
import { POLLING } from '@/configuration/polling.constants';

import { useGetFramework } from '@/data/hooks/ai/capabilities/useGetFramework.hook';

import {
  getFramework,
  getRegions,
} from '@/data/api/ai/capabilities/capabilities.api';
import queryClient from '@/query.client';
import { useGetRegions } from '@/data/hooks/ai/capabilities/useGetRegions.hook';
import { getNotebooks } from '@/data/api/ai/notebook/notebook.api';
import { QpuRoadmapLinks } from '@/configuration/roadmap-changelog.constants';
import { useGetNotebooks } from '@/data/hooks/ai/notebook/useGetNotebooks.hook';

interface QpuProps {
  params: {
    projectId: string;
  };
  request: Request;
}

export const Loader = async ({ params }: QpuProps) => {
  const { projectId } = params;

  const regions = await queryClient.fetchQuery({
    queryKey: [projectId],
    queryFn: () => getRegions({ projectId }),
  });
  const notebooks = await queryClient.fetchQuery({
    queryKey: [projectId, 'ai', 'notebook'],
    queryFn: () => getNotebooks({ projectId }),
  });

  const fmks = await queryClient.fetchQuery({
    queryKey: [projectId, 'ai', 'capabilities', regions[0].id, 'framework'],
    queryFn: () => getFramework({ projectId, region: regions[0].id }),
  });
  const filterFmkIds = fmks
    .filter((fmk) => fmk.type === 'AI')
    .map((fwk) => fwk.id);

  if (
    notebooks.filter((nb) => filterFmkIds.includes(nb.spec.env.frameworkId))
      .length === 0
  ) {
    return redirect(`/pci/projects/${projectId}/ai-ml/quantum/qpu/onboarding`);
  }
  return null;
};

const Qpus = () => {
  const { projectId } = useParams();
  const { isUserActive } = useUserActivityContext();
  const { t } = useTranslation('ai-tools/notebooks');
  const regionQuery = useGetRegions(projectId);
  const notebooksQuery = useGetNotebooks(projectId, {
    refetchInterval: isUserActive && POLLING.NOTEBOOKS,
  });
  const regionId = regionQuery?.data?.length > 0 && regionQuery?.data[0]?.id;
  const fmkQuery = useGetFramework(projectId, regionId, {
    enabled: !!regionId,
  });

  if (notebooksQuery.isLoading || regionQuery.isLoading || fmkQuery.isLoading)
    return <QpusList.Skeleton />;

  const filterFmkIds = fmkQuery.data
    .filter((fmk) => fmk.type === 'quantum-qpu')
    .map((fwk) => fwk.id);

  return (
    <>
      <div
        data-testid="notebooks-guides-container"
        className="flex justify-between w-full items-center"
      >
        <h2>{t('title')}</h2>
        <div className="flex flex-wrap justify-end gap-1">
          <RoadmapChangelog links={QpuRoadmapLinks} />
        </div>
      </div>
      <QpusList
        qpus={notebooksQuery.data.filter((nb) =>
          filterFmkIds.includes(nb.spec.env.frameworkId),
        )}
      />
      <Outlet />
    </>
  );
};

export default Qpus;
