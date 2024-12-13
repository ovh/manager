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
import { getAIApiErrorMessage } from '@/lib/apiHelper';
import { useStartNotebook } from '@/hooks/api/ai/notebook/useStartNotebook.hook';
import RouteModal from '@/components/route-modal/RouteModal';

interface StartNotebookProps {
  notebook: ai.notebook.Notebook;
  onSuccess?: () => void;
  onError?: (notebook: Error) => void;
  onClose?: () => void;
}

const StartNotebook = ({
  notebook,
  onError,
  onSuccess,
  onClose,
}: StartNotebookProps) => {
  const { projectId } = useParams();

  const { t } = useTranslation('pci-ai-notebooks/notebooks/notebook');
  const toast = useToast();

  const { startNotebook, isPending } = useStartNotebook({
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
    onStartSuccess: () => {
      toast.toast({
        title: t('notebookToastSuccessTitle'),
        description: t('startNotebookToastSuccessDescription', {
          name: notebook.spec.name,
        }),
      });
      if (onSuccess) {
        onSuccess();
      }
    },
  });

  const handleStart = () => {
    startNotebook({
      projectId,
      notebookId: notebook.id,
    });
  };

  return (
    <RouteModal backUrl="../" isLoading={!notebook?.id} onClose={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle data-testid="start-notebook-modal">
            {t('startNotebookTitle')}
          </DialogTitle>
        </DialogHeader>
        <p className="mt-2">
          {t('startNotebookDescription', {
            name: notebook?.spec.name,
          })}
        </p>
        <DialogFooter className="flex justify-end">
          <DialogClose asChild>
            <Button
              data-testid="start-notebook-cancel-button"
              type="button"
              variant="outline"
            >
              {t('notebookButtonCancel')}
            </Button>
          </DialogClose>
          <Button
            data-testid="start-notebook-submit-button"
            type="button"
            disabled={isPending}
            onClick={handleStart}
          >
            {t('startNotebookButtonConfirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </RouteModal>
  );
};

export default StartNotebook;
