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
import { useDeleteNotebook } from '@/data/hooks/ai/notebook/useDeleteNotebook.hook';
import { useTrackAction } from '@/hooks/useTracking';
import { TRACKING } from '@/configuration/tracking.constants';
import { useQuantum } from '@/hooks/useQuantum.hook';

interface DeleteNotebookProps {
  notebook: ai.notebook.Notebook;
  onSuccess?: (notebook: ai.notebook.Notebook) => void;
  onError?: (notebook: Error) => void;
  trackingCategory?: string;
}

const DeleteNotebook = ({
  notebook,
  onError,
  onSuccess,
  trackingCategory,
}: DeleteNotebookProps) => {
  const { projectId } = useParams();
  const { t } = useTranslation('ai-tools/notebooks/notebook');
  const toast = useToast();
  const track = useTrackAction();
  const { mode } = useQuantum();

  const { deleteNotebook, isPending } = useDeleteNotebook({
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
    onDeleteSuccess: () => {
      toast.toast({
        title: t('notebookToastSuccessTitle'),
        description: t('deleteNotebookToastSuccessDescription', {
          name: notebook.spec.name,
        }),
      });
      if (onSuccess) {
        onSuccess(notebook);
      }
    },
  });

  const handleDelete = () => {
    if (mode === 'emulators') {
      track(
        TRACKING.emulators.popup.deleteNotebookClick('confirm'),
        trackingCategory,
      );
    } else if (mode === 'qpu') {
      track(
        TRACKING.qpus.popup.deleteNotebookClick('confirm'),
        trackingCategory,
      );
    }
    deleteNotebook({
      projectId,
      notebookId: notebook.id,
    });
  };
  return (
    <RouteModal backUrl="../" isLoading={!notebook?.id}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle data-testid="delete-notebook-modal">
            {t('deleteNotebookTitle')}
          </DialogTitle>
        </DialogHeader>
        <p className="mt-2">
          {t('deleteNotebookDescription', {
            name: notebook?.spec.name,
          })}
        </p>
        <DialogFooter className="flex justify-end">
          <DialogClose asChild>
            <Button
              data-testid="delete-notebook-cancel-button"
              type="button"
              mode="outline"
              onClick={() => {
                if (mode === 'emulators') {
                  track(
                    TRACKING.emulators.popup.deleteNotebookClick('cancel'),
                    trackingCategory,
                  );
                } else if (mode === 'qpu') {
                  track(
                    TRACKING.qpus.popup.deleteNotebookClick('cancel'),
                    trackingCategory,
                  );
                }
              }}
            >
              {t('notebookButtonCancel')}
            </Button>
          </DialogClose>
          <Button
            data-testid="delete-notebook-submit-button"
            type="button"
            disabled={isPending}
            onClick={handleDelete}
          >
            {t('deleteNotebookButtonConfirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </RouteModal>
  );
};

export default DeleteNotebook;
