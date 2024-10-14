import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import Link from '@/components/links/Link.component';
import { Button } from '@/components/ui/button';
import { POLLING } from '@/configuration/polling.constants';
import { useUserActivityContext } from '@/contexts/UserActivityContext';
import { useGetNotebooks } from '@/hooks/api/ai/notebook/useGetNotebooks.hook';
import Guides from '@/components/guides/Guides.component';
import NotebooksList from './_components/NotebooksListTable.component';
import Onboarding from './_components/Onboarding.component';

const Notebooks = () => {
  const { t } = useTranslation('pci-ai-notebooks/notebooks');
  const { projectId } = useParams();
  const { isUserActive } = useUserActivityContext();
  const notebooksQuery = useGetNotebooks(projectId, {
    refetchInterval: isUserActive && POLLING.NOTEBOOKS,
  });

  if (notebooksQuery.isLoading) return <NotebooksList.Skeleton />;
  if (notebooksQuery.isSuccess && notebooksQuery.data.length === 0) {
    return <Onboarding />;
  }
  return (
    <>
      <div
        data-testid="services-guides-container"
        className="flex justify-between w-full items-center"
      >
        <h2>{t('title')}</h2>
        <Guides />
      </div>
      <Button
        data-testid="create-notebook-button"
        variant="outline"
        size="sm"
        className="text-base"
        asChild
      >
        <Link to="./new" className="hover:no-underline">
          <Plus className="w-4 h-4 mr-2" />
          {t('createNewNotebook')}
        </Link>
      </Button>
      <NotebooksList
        notebooks={notebooksQuery.data}
        refetchFn={notebooksQuery.refetch}
      />
    </>
  );
};

export default Notebooks;
