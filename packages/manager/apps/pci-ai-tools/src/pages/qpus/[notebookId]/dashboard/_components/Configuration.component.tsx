import { Files } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  useToast,
} from '@datatr-ux/uxlib';
import { useNotebookData } from '../../Notebook.context';
import { isStoppedNotebook } from '@/lib/statusHelper';

const Configurations = () => {
  const { notebook } = useNotebookData();
  const { t } = useTranslation('ai-tools/notebooks/notebook/dashboard');
  const navigate = useNavigate();
  const toast = useToast();

  return (
    <div data-testid="configuration-container">
      <div className="flex justify-between items-center text-base mr-2">
        <div className="flex flex-row gap-2">
          <p className="font-semibold">{t('notebookIdLabel')}</p>
          <p>{notebook.id}</p>
        </div>
        <Button
          data-testid="dashboard-copy-id-button"
          type="button"
          size="menu"
          variant="menu"
          mode="menu"
          className="shrink-0"
          onClick={() => {
            navigator.clipboard.writeText(notebook.id);
            toast.toast({
              title: t('notebookIdCopyToast'),
            });
          }}
        >
          <Files className="w-4 h-4" />
          <span className="sr-only">copy</span>
        </Button>
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-block w-full" tabIndex={0}>
              <Button
                data-testid="notebook-config-delete-button"
                variant="destructive"
                className="w-full mt-4"
                onClick={() => navigate('./delete')}
                disabled={!isStoppedNotebook(notebook.status.state)}
              >
                {t('deleteNotebookButton')}
              </Button>
            </span>
          </TooltipTrigger>
          {!isStoppedNotebook(notebook.status.state) && (
            <TooltipContent>{t('deleteNotebookTooltip')}</TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default Configurations;
