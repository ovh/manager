import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useParams, Outlet } from 'react-router-dom';
import Link from '@/components/links/Link.component';
import { Button } from '@/components/ui/button';
import { POLLING } from '@/configuration/polling.constants';
import { useUserActivityContext } from '@/contexts/UserActivityContext';
import { useGetNotebooks } from '@/hooks/api/ai/notebook/useGetNotebooks.hook';
import Guides from '@/components/guides/Guides.component';
import NotebooksList from './_components/NotebooksListTable.component';

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
        <Guides />
      </div>
      <Button
        variant="default"
        type="button"
        data-testid="create-notebook-button"
        asChild
      >
        <Link to="./new" className="hover:no-underline">
          <Plus className="w-4 h-4 mr-2" />
          {t('createNewNotebook')}
        </Link>
      </Button>
      <NotebooksList notebooks={notebooksQuery.data} />
      <Outlet />
    </>
  );
};

export default Notebooks;
