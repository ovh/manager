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

interface DeleteNotebookProps {
  notebook: ai.notebook.Notebook;
  onSuccess?: (notebook: ai.notebook.Notebook) => void;
  onError?: (notebook: Error) => void;
}

const DeleteNotebook = ({
  notebook,
  onError,
  onSuccess,
}: DeleteNotebookProps) => {
  const { projectId } = useParams();
  const { t } = useTranslation('ai-tools/notebooks/notebook');
  const toast = useToast();

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
