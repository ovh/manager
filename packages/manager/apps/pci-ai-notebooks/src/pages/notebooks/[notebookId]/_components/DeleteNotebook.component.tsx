import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import * as ai from '@/types/cloud/project/ai';
import { useDeleteNotebook } from '@/hooks/api/ai/notebook/useDeleteNotebook.hook';
import { getAIApiErrorMessage } from '@/lib/apiHelper';
import RouteModal from '@/components/route-modal/RouteModal';

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
  const { t } = useTranslation('pci-ai-notebooks/notebooks/notebook');
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
              variant="outline"
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
