import { Files } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useNotebookData } from '../../Notebook.context';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import DeleteNotebook from '../../_components/DeleteNotebook.component';
import { useGetNotebooks } from '@/hooks/api/ai/notebook/useGetNotebooks.hook';
import { useModale } from '@/hooks/useModale';
import { isRunningNotebook } from '@/lib/notebookHelper';

const Configurations = () => {
  const { notebook, notebookQuery, projectId } = useNotebookData();
  const { t } = useTranslation('pci-ai-notebooks/notebooks/notebook/dashboard');
  const navigate = useNavigate();
  const toast = useToast();
  const deleteModale = useModale('delete');

  const getNotebooksQuery = useGetNotebooks(projectId, {
    enabled: false,
  });

  return (
    <div data-testid="configuration-container">
      <div className="flex justify-between text-base mr-2">
        <div className="flex flex-row gap-2">
          <p className="font-semibold">{t('notebookIdLabel')}</p>
          <p>{notebook.id}</p>
        </div>
        <Button
          data-testid="dashboard-copy-id-button"
          type="button"
          size="table"
          variant="table"
          onClick={() => {
            navigator.clipboard.writeText(notebook.id);
            toast.toast({
              title: t('notebookIdCopyToast'),
            });
          }}
        >
          <Files className="w-4 h-4" />
        </Button>
      </div>
      <Button
        data-testid="service-confi-delete-button"
        variant="destructive"
        className="w-full bg-background border-2 hover:bg-destructive/10 font-semibold border-destructive text-destructive mt-4"
        onClick={() => deleteModale.open()}
        disabled={
          isRunningNotebook(notebook.status.state)
        }
      >
        {t('deleteNotebookButton')}
      </Button>
      <DeleteNotebook
        controller={deleteModale.controller}
        notebook={notebook}
        onSuccess={() => {
          navigate(`../../../`);
          deleteModale.close();
          getNotebooksQuery.refetch();
          
        }}
      />
    </div>
  );
};

export default Configurations;
