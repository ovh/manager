import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import * as ai from '@/types/cloud/project/ai';
import { ModalController } from '@/hooks/useModale';
import { getAIApiErrorMessage } from '@/lib/apiHelper';
import { useStopNotebook } from '@/hooks/api/ai/notebook/useStopNotebook.hook';

interface StopNotebookModalProps {
  notebook: ai.notebook.Notebook;
  controller: ModalController;
  onSuccess?: () => void;
  onError?: (service: Error) => void;
}

const StopNotebook = ({
  notebook,
  controller,
  onError,
  onSuccess,
}: StopNotebookModalProps) => {
  const { projectId } = useParams();

  const { t } = useTranslation('pci-ai-notebooks/notebooks/notebook');
  const toast = useToast();

  const { stopNotebook, isPending } = useStopNotebook({
    onError: (err) => {
      toast.toast({
        title: t('notebookToastErrorTitle'),
        variant: 'destructive',
        description: getAIApiErrorMessage(err),
      });
      if (onError) {
        onError(err);
      }
    },
    onStopSuccess: () => {
      toast.toast({
        title: t('notebookToastSuccessTitle'),
        description: t('stopNotebookToastSuccessDescription', {
          name: notebook.spec.name,
        }),
      });
      if (onSuccess) {
        onSuccess();
      }
    },
  });

  const handleStop = () => {
    stopNotebook({
      projectId,
      notebookId: notebook.id,
    });
  };
  return (
    <Dialog {...controller}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle data-testid="stop-notebook-modal">
            {t('stopNotebookTitle')}
          </DialogTitle>
        </DialogHeader>
        <p className="mt-2">{t('stopNotebookDescription1')}</p>
        <ul className="list-disc pl-5">
          <li className="ml-3">{t('stopNotebookDescriptionList1')}</li>
          <li className="ml-3">{t('stopNotebookDescriptionList2')}</li>
          <li className="ml-3">{t('stopNotebookDescriptionList3')}</li>
        </ul>
        <div className="inline">
          <span>{t('stopNotebookDescription2')}</span>
          <span> </span>
          <span className="font-bold">{t('stopNotebookDescription2Bis')}</span>
          <span> </span>
          <span>{t('stopNotebookDescription2Ter')}</span>
          <span> </span>
          <span className="font-bold">
            {t('stopNotebookDescription2Quater')}
          </span>
          <span>.</span>
        </div>
        <p>{t('stopNotebookDescription3')}</p>
        <p className="mt-2">
          {t('stopNotebookConfirmation', {
            name: notebook?.spec.name,
          })}
        </p>
        <DialogFooter className="flex justify-end">
          <DialogClose asChild>
            <Button
              data-testid="stop-notebook-cancel-button"
              type="button"
              variant="outline"
            >
              {t('notebookButtonCancel')}
            </Button>
          </DialogClose>
          <Button
            data-testid="stop-notebook-submit-button"
            type="button"
            disabled={isPending}
            onClick={handleStop}
          >
            {t('stopNotebookButtonConfirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StopNotebook;
