import { useTranslation } from 'react-i18next';
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
import { getFramework } from '@/data/api/ai/capabilities/capabilities.api';

interface NotebooksProps {
  params: {
    projectId: string;
    quantum: string;
  };
  request: Request;
}

export const Loader = async ({ params }: NotebooksProps) => {
  const { projectId, quantum } = params;
  const notebooks = await queryClient.fetchQuery({
    queryKey: [projectId, 'ai', 'notebook'],
    queryFn: () => getNotebooks({ projectId }),
  });
  const fmks = await queryClient.fetchQuery({
    queryKey: [projectId, 'ai', 'capabilities', 'region', 'framework'],
    queryFn: () => getFramework({ projectId, region: 'GRA' }),
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
  const { t } = useTranslation('ai-tools/notebooks');
  const { projectId, quantum } = useParams();
  const { isUserActive } = useUserActivityContext();
  const notebooksQuery = useGetNotebooks(projectId, {
    refetchInterval: isUserActive && POLLING.NOTEBOOKS,
  });
  const fmkQuery = useGetFramework(projectId, 'GRA');

  if (notebooksQuery.isLoading || fmkQuery.isLoading)
    return <NotebooksList.Skeleton />;
  const filterFmkIds = fmkQuery.data
    .filter((fmk) =>
      quantum === 'quantum' ? fmk.type === 'Quantum' : fmk.type === 'AI',
    )
    .map((fwk) => fwk.id);

  console.log(
    notebooksQuery.data.filter((nb) =>
      filterFmkIds.includes(nb.spec.env.frameworkId),
    ),
  );
  return (
    <>
      <div
        data-testid="notebooks-guides-container"
        className="flex justify-between w-full items-center"
      >
        <h2>{quantum === 'quantum' ? t('quantumTitle') : t('title')}</h2>
        <div className="flex flex-wrap justify-end gap-1">
          <RoadmapChangelog
            links={
              quantum !== 'quantum'
                ? EmulatorRoadmapLinks
                : NotebookRoadmapLinks
            }
          />
          {quantum !== 'quantum' && <Guides section={notebookGuidesSections} />}
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
