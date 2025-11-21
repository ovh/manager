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
import { useReStartNotebook } from '@/data/hooks/ai/notebook/useReStartNotebook.hook';

interface ReStartNotebookProps {
  notebook: ai.notebook.Notebook;
  onSuccess?: () => void;
  onError?: (notebook: Error) => void;
  onClose?: () => void;
}

const ReStartNotebook = ({
  notebook,
  onError,
  onSuccess,
  onClose,
}: ReStartNotebookProps) => {
  const { projectId } = useParams();

  const { t } = useTranslation('ai-tools/notebooks/notebook');
  const toast = useToast();

  const { reStartNotebook, isPending } = useReStartNotebook({
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
    onReStartSuccess: () => {
      toast.toast({
        title: t('notebookToastSuccessTitle'),
        description: t('reStartNotebookToastSuccessDescription', {
          name: notebook.spec.name,
        }),
      });
      if (onSuccess) {
        onSuccess();
      }
    },
  });

  const handleReStart = () => {
    reStartNotebook({
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
              {t('reStartNotebookTitle')}
            </DialogTitle>
          </DialogHeader>
          <p className="mt-2">
            {t('reStartNotebookDescription', {
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
              onClick={handleReStart}
            >
              {t('reStartNotebookButtonConfirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </RouteModal>
    </div>
  );
};

export default ReStartNotebook;
