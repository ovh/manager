import { useTranslation } from 'react-i18next';
import { useParams, Outlet } from 'react-router-dom';
import { POLLING } from '@/configuration/polling.constants';
import { useUserActivityContext } from '@/contexts/UserActivityContext';
import { useGetNotebooks } from '@/hooks/api/ai/notebook/useGetNotebooks.hook';
import Guides from '@/components/guides/Guides.component';
import NotebooksList from './_components/NotebooksListTable.component';
import { notebookGuidesSections } from '@/configuration/guide';

const Notebooks = () => {
  const { t } = useTranslation('pci-ai-notebooks/notebooks');
  const { projectId } = useParams();
  const { isUserActive } = useUserActivityContext();
  const notebooksQuery = useGetNotebooks(projectId, {
    refetchInterval: isUserActive && POLLING.NOTEBOOKS,
  });

  if (notebooksQuery.isLoading) return <NotebooksList.Skeleton />;
  return (
    <>
      <div
        data-testid="notebooks-guides-container"
        className="flex justify-between w-full items-center"
      >
        <h2>{t('title')}</h2>
        <Guides section={notebookGuidesSections} />
      </div>
      <NotebooksList notebooks={notebooksQuery.data} />
      <Outlet />
    </>
  );
};

export default Notebooks;
