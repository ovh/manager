import { useParams, Outlet, redirect } from 'react-router-dom';
import { POLLING } from '@/configuration/polling.constants';
import { useUserActivityContext } from '@/contexts/UserActivityContext';
import Guides from '@/components/guides/Guides.component';
import NotebooksList from './_components/NotebooksListTable.component';
import { notebookGuidesSections } from '@/configuration/guide';
import { useGetNotebooks } from '@/data/hooks/ai/notebook/useGetNotebooks.hook';
import queryClient from '@/query.client';
import { getNotebooks } from '@/data/api/ai/notebook/notebook.api';
import { useGetFramework } from '@/data/hooks/ai/capabilities/useGetFramework.hook';
import RoadmapChangelog from '@/components/roadmap-changelog/RoadmapChangelog.component';
import {
  EmulatorRoadmapLinks,
  NotebookRoadmapLinks,
} from '@/configuration/roadmap-changelog.constants';
import {
  getFramework,
  getRegions,
} from '@/data/api/ai/capabilities/capabilities.api';
import { useQuantum } from '@/hooks/useQuantum.hook';
import { useGetRegions } from '@/data/hooks/ai/capabilities/useGetRegions.hook';

interface NotebooksProps {
  params: {
    projectId: string;
    quantum: string;
  };
  request: Request;
}

export const Loader = async ({ params }: NotebooksProps) => {
  const { projectId, quantum } = params;
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
    .filter((fmk) =>
      quantum === 'quantum' ? fmk.type === 'Quantum' : fmk.type === 'AI',
    )
    .map((fwk) => fwk.id);

  if (
    notebooks.filter((nb) => filterFmkIds.includes(nb.spec.env.frameworkId))
      .length === 0
  ) {
    return quantum === 'quantum'
      ? redirect(
          `/pci/projects/${projectId}/ai-ml/quantum/notebooks/onboarding`,
        )
      : redirect(`/pci/projects/${projectId}/ai-ml/notebooks/onboarding`);
  }
  return null;
};

const Notebooks = () => {
  const { projectId } = useParams();
  const { isQuantum, t } = useQuantum('ai-tools/notebooks');
  const { isUserActive } = useUserActivityContext();
  const regionQuery = useGetRegions(projectId);
  const notebooksQuery = useGetNotebooks(projectId, {
    refetchInterval: isUserActive && POLLING.NOTEBOOKS,
  });
  const regionId = regionQuery?.data?.length > 0 && regionQuery?.data[0]?.id;
  const fmkQuery = useGetFramework(projectId, regionId, {
    enabled: !!regionId,
  });

  if (notebooksQuery.isLoading || regionQuery.isLoading || fmkQuery.isLoading)
    return <NotebooksList.Skeleton />;

  const filterFmkIds = fmkQuery.data
    .filter((fmk) => (isQuantum ? fmk.type === 'Quantum' : fmk.type === 'AI'))
    .map((fwk) => fwk.id);

  return (
    <>
      <div
        data-testid="notebooks-guides-container"
        className="flex justify-between w-full items-center"
      >
        <h2>{t('title')}</h2>
        <div className="flex flex-wrap justify-end gap-1">
          <RoadmapChangelog
            links={isQuantum ? EmulatorRoadmapLinks : NotebookRoadmapLinks}
          />
          {!isQuantum && <Guides section={notebookGuidesSections} />}
        </div>
      </div>
      <NotebooksList
        notebooks={notebooksQuery.data.filter((nb) =>
          filterFmkIds.includes(nb.spec.env.frameworkId),
        )}
      />
      <Outlet />
    </>
  );
};

export default Notebooks;
