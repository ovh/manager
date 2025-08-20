import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Button,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  useToast,
} from '@datatr-ux/uxlib';
import ai from '@/types/AI';
import { getAIApiErrorMessage } from '@/lib/apiHelper';
import RouteModal from '@/components/route-modal/RouteModal';
import { useStopNotebook } from '@/data/hooks/ai/notebook/useStopNotebook.hook';

interface StopNotebookProps {
  notebook: ai.notebook.Notebook;
  onSuccess?: () => void;
  onError?: (notebook: Error) => void;
  onClose?: () => void;
}

const StopNotebook = ({
  notebook,
  onError,
  onSuccess,
  onClose,
}: StopNotebookProps) => {
  const { projectId } = useParams();

  const { t } = useTranslation('ai-tools/notebooks/notebook');
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
    <RouteModal backUrl="../" isLoading={!notebook?.id} onClose={onClose}>
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
              mode="outline"
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
    </RouteModal>
  );
};

export default StopNotebook;
