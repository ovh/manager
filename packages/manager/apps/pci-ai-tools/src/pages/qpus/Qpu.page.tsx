import { Outlet, redirect, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUserActivityContext } from '@/contexts/UserActivityContext';
import RoadmapChangelog from '@/components/roadmap-changelog/RoadmapChangelog.component';
import QpusList from './_components/QpusListTable.component';
import { POLLING } from '@/configuration/polling.constants';
import { useGetFramework } from '@/data/hooks/ai/capabilities/useGetFramework.hook';
import { useGetRegions } from '@/data/hooks/ai/capabilities/useGetRegions.hook';
import { useGetNotebooks } from '@/data/hooks/ai/notebook/useGetNotebooks.hook';
import { useGetNotebooksQPU } from '@/data/hooks/ai/notebook/useGetNotebooksQPU.hook';
import queryClient from '@/query.client';
import {
  getFramework,
  getRegions,
} from '@/data/api/ai/capabilities/capabilities.api';
import { getNotebooks } from '@/data/api/ai/notebook/notebook.api';
import { QpuRoadmapLinks } from '@/configuration/roadmap-changelog.constants';
import { NotebookWithQpu } from '@/types/orderFunnel';

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
    queryFn: () => getFramework({ projectId, region: regions[0].id }),
  });

  const qpuFrameworkIds = frameworks
    .filter((f) => f.type === 'quantum-qpu')
    .map((f) => f.id);

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
  const regionQuery = useGetRegions(projectId);
  const regionId = regionQuery?.data?.length > 0 && regionQuery?.data[0]?.id;
  const notebooksQuery = useGetNotebooks(projectId, {
    refetchInterval: isUserActive && POLLING.NOTEBOOKS,
  });

  const fmkQuery = useGetFramework(projectId, regionId, {
    enabled: !!regionId,
  });

  const notebooks = notebooksQuery.data ?? [];

  // Extract only notebooks that have a QPU
  const notebooksWithQpuId = notebooks.filter(
    (nb) => nb.spec.quantumResources?.qpuFlavorId,
  );

  // Hook to enrich QPU notebooks with their details
  const { notebooksWithQPU, isLoading: isQpuLoading } = useGetNotebooksQPU(
    projectId,
    notebooksWithQpuId,
  );

  if (
    notebooksQuery.isLoading ||
    regionQuery.isLoading ||
    fmkQuery.isLoading ||
    isQpuLoading
  ) {
    return <QpusList.Skeleton />;
  }

  // Frameworks QPU
  const qpuFrameworkIds =
    fmkQuery.data?.filter((f) => f.type === 'quantum-qpu').map((f) => f.id) ??
    [];

  // Merge all notebooks (with or without QPU)
  const allNotebooks: NotebookWithQpu[] = notebooks.map((nb) => ({
    ...nb,
    qpuDetail: notebooksWithQPU.find((nq) => nq.id === nb.id)?.qpuDetail,
  }));

  // Keep only notebooks whose framework is of type QPU
  const filteredNotebooks = allNotebooks.filter((nb) =>
    qpuFrameworkIds.includes(nb.spec.env.frameworkId),
  );

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
      <QpusList qpus={filteredNotebooks} />
      <Outlet />
    </>
  );
};

export default Qpus;
