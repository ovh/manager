import { Outlet, redirect, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUserActivityContext } from '@/contexts/UserActivityContext';
import RoadmapChangelog from '@/components/roadmap-changelog/RoadmapChangelog.component';
import QpusList from './_components/QpusListTable.component';
import { POLLING } from '@/configuration/polling.constants';
import { useGetFramework } from '@/data/hooks/ai/capabilities/useGetFramework.hook';
import { useGetNotebooks } from '@/data/hooks/ai/notebook/useGetNotebooks.hook';
import queryClient from '@/query.client';
import {
  getFramework,
  getRegions,
} from '@/data/api/ai/capabilities/capabilities.api';
import { getNotebooks } from '@/data/api/ai/notebook/notebook.api';
import Guides from '@/components/guides/Guides.component';
import { QpuRoadmapLinks } from '@/configuration/roadmap-changelog.constants';
import { useGetQpuRegions } from '@/data/hooks/ai/capabilities/useGetQpuRegions.hook';

export const Loader = async ({ params }: { params: { projectId: string } }) => {
  const { projectId } = params;

  const [regions, notebooks] = await Promise.all([
    queryClient.fetchQuery({
      queryKey: [projectId, 'regions'],
      queryFn: () => getRegions({ projectId }),
    }),
    queryClient.fetchQuery({
      queryKey: [projectId, 'ai', 'notebook'],
      queryFn: () => getNotebooks({ projectId }),
    }),
  ]);

  const frameworks = await queryClient.fetchQuery({
    queryKey: [projectId, 'ai', 'capabilities', regions[0].id, 'framework'],
    queryFn: () =>
      getFramework({ projectId, region: regions[0].id, type: 'quantum-qpu' }),
  });

  const qpuFrameworkIds = frameworks.map((f) => f.id);

  const hasQpuNotebook = notebooks.some((nb) =>
    qpuFrameworkIds.includes(nb.spec.env.frameworkId),
  );

  return hasQpuNotebook
    ? null
    : redirect(`/pci/projects/${projectId}/ai-ml/quantum/qpu/onboarding`);
};

const Qpus = () => {
  const { projectId } = useParams();
  const { isUserActive } = useUserActivityContext();
  const { t } = useTranslation('ai-tools/notebooks');
  const regionQuery = useGetQpuRegions(projectId);
  const regionId = regionQuery?.data?.length > 0 && regionQuery?.data[0]?.id;
  const notebooksQuery = useGetNotebooks(projectId, {
    refetchInterval: isUserActive && POLLING.NOTEBOOKS,
  });

  const fmkQuery = useGetFramework(projectId, regionId, 'quantum-qpu', {
    enabled: !!regionId,
  });

  const notebooks = notebooksQuery.data ?? [];

  if (notebooksQuery.isLoading || regionQuery.isLoading || fmkQuery.isLoading) {
    return <QpusList.Skeleton />;
  }

  const qpuFrameworkIds = fmkQuery.data?.map((f) => f.id) ?? [];

  const filteredNotebooks = notebooks.filter((nb) =>
    qpuFrameworkIds.includes(nb.spec.env.frameworkId),
  );

  return (
    <>
      <div
        data-testid="notebooks-guides-container"
        className="flex justify-between w-full items-center"
      >
        <h2>{t('qpuTitle')}</h2>
        <div className="flex flex-wrap justify-end gap-1">
          <RoadmapChangelog links={QpuRoadmapLinks} />
          <Guides category={'quantum'} />
        </div>
      </div>
      <QpusList qpus={filteredNotebooks} />
      <Outlet />
    </>
  );
};

export default Qpus;
