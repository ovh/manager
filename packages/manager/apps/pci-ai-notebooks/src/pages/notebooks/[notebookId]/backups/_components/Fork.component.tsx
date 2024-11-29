import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { useForkBackup } from '@/hooks/api/ai/notebook/backups/useForkBackup.hook';
import { ModalController } from '@/hooks/useModale';
import { getAIApiErrorMessage } from '@/lib/apiHelper';
import * as ai from '@/types/cloud/project/ai';
import { useNotebookData } from '../../Notebook.context';
import { Button } from '@/components/ui/button';

interface ForkModalProps {
  backup: ai.notebook.Backup;
  controller: ModalController;
  onSuccess?: (notebook: ai.notebook.Notebook) => void;
  onError?: (notebook: Error) => void;
}

const Fork = ({ backup, controller, onError, onSuccess }: ForkModalProps) => {
  const { notebook, projectId } = useNotebookData();
  const { t } = useTranslation('pci-ai-notebooks/notebooks/notebook/backups');
  const toast = useToast();

  const { forkBackup, isPending } = useForkBackup({
    onError: (err) => {
      toast.toast({
        title: t('forkToastErrorTitle'),
        variant: 'destructive',
        description: getAIApiErrorMessage(err),
      });
      if (onError) {
        onError(err);
      }
    },
    onSuccess: (newNotebook) => {
      toast.toast({
        title: t('forkToastSuccessTitle'),
        description: t('forkToastSuccessDescription'),
      });
      if (onSuccess) {
        onSuccess(newNotebook);
      }
    },
  });

  const handleFork = () => {
    forkBackup({
      projectId,
      notebookId: notebook.id,
      backupId: backup.id,
    });
  };

  return (
    <Dialog {...controller}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle data-testid="fork-modal">
            {t('forkBackupTitle')}
          </DialogTitle>
        </DialogHeader>
        <p className="mt-2">
          {t('forkBackupDescription', {
            id: backup.id,
            date: backup.createdAt,
          })}
        </p>
        <DialogFooter className="flex justify-end">
          <DialogClose asChild>
            <Button
              data-testid="fork-backup-cancel-button"
              type="button"
              variant="outline"
            >
              {t('forkButtonCancel')}
            </Button>
          </DialogClose>
          <Button
            data-testid="fork-backup-submit-button"
            type="button"
            disabled={isPending}
            onClick={handleFork}
          >
            {t('forkBackupButtonConfirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Fork;
