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
import { useRestartNotebook } from '@/data/hooks/ai/notebook/useRestartNotebook.hook';

interface RestartNotebookProps {
  notebook: ai.notebook.Notebook;
  onSuccess?: () => void;
  onError?: (notebook: Error) => void;
  onClose?: () => void;
}

const RestartNotebook = ({
  notebook,
  onError,
  onSuccess,
  onClose,
}: RestartNotebookProps) => {
  const { projectId } = useParams();

  const { t } = useTranslation('ai-tools/notebooks/notebook');
  const toast = useToast();

  const { restartNotebook, isPending } = useRestartNotebook({
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
    onSuccess: () => {
      toast.toast({
        title: t('notebookToastSuccessTitle'),
        description: t('restartNotebookToastSuccessDescription', {
          name: notebook.spec.name,
        }),
      });
      if (onSuccess) {
        onSuccess();
      }
    },
  });

  const handleRestart = () => {
    restartNotebook({
      projectId,
      notebookId: notebook.id,
    });
  };

  return (
    <div title="restart">
      <RouteModal backUrl="../" isLoading={!notebook?.id} onClose={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle data-testid="restart-notebook-modal">
              {t('restartNotebookTitle')}
            </DialogTitle>
          </DialogHeader>
          <p className="mt-2">
            {t('restartNotebookDescription', {
              name: notebook?.spec.name,
            })}
          </p>
          <DialogFooter className="flex justify-end">
            <DialogClose asChild>
              <Button
                data-testid="restart-notebook-cancel-button"
                type="button"
                mode="outline"
              >
                {t('notebookButtonCancel')}
              </Button>
            </DialogClose>
            <Button
              data-testid="restart-notebook-submit-button"
              type="button"
              disabled={isPending}
              onClick={handleRestart}
            >
              {t('restartNotebookButtonConfirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </RouteModal>
    </div>
  );
};

export default RestartNotebook;
