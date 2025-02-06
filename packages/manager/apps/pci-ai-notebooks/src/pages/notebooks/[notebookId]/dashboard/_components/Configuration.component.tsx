import { Files } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useNotebookData } from '../../Notebook.context';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { isStoppedNotebook } from '@/lib/statusHelper';

const Configurations = () => {
  const { notebook } = useNotebookData();
  const { t } = useTranslation('pci-ai-notebooks/notebooks/notebook/dashboard');
  const navigate = useNavigate();
  const toast = useToast();

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
        data-testid="notebook-config-delete-button"
        variant="destructive"
        className="w-full bg-background border-2 hover:bg-destructive/10 font-semibold border-destructive text-destructive mt-4"
        onClick={() => navigate('./delete')}
        disabled={!isStoppedNotebook(notebook.status.state)}
      >
        {t('deleteNotebookButton')}
      </Button>
    </div>
  );
};

export default Configurations;
