import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useMemo } from 'react';
import {
  Button,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  useToast,
} from '@datatr-ux/uxlib';
import { getAIApiErrorMessage } from '@/lib/apiHelper';
import ai from '@/types/AI';
import RouteModal from '@/components/route-modal/RouteModal';
import { useNotebookData } from '../../Notebook.context';
import { useGetBackup } from '@/data/hooks/ai/notebook/backups/useGetBackup.hook';
import { useForkBackup } from '@/data/hooks/ai/notebook/backups/useForkBackup.hook';

const Fork = () => {
  const { notebook, projectId } = useNotebookData();
  const { backupId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation('ai-tools/notebooks/notebook/backups');
  const backupQuery = useGetBackup(projectId, notebook.id, backupId);
  const toast = useToast();

  const backup: ai.notebook.Backup = useMemo(() => {
    return backupQuery.data;
  }, [backupId, backupQuery.isSuccess]);

  const { forkBackup, isPending } = useForkBackup({
    onError: (err) => {
      toast.toast({
        title: t('forkToastErrorTitle'),
        variant: 'destructive',
        description: getAIApiErrorMessage(err),
      });
    },
    onSuccess: (newNotebook) => {
      toast.toast({
        title: t('forkToastSuccessTitle'),
        description: t('forkToastSuccessDescription'),
      });
      navigate(`../../../${newNotebook.id}`);
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
    <RouteModal backUrl="../" isLoading={!backupQuery.isSuccess || !backup}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle data-testid="fork-modal">
            {t('forkBackupTitle')}
          </DialogTitle>
        </DialogHeader>
        {backup && (
          <p className="mt-2">
            {t('forkBackupDescription', {
              id: backup.id,
              date: backup.createdAt,
            })}
          </p>
        )}
        <DialogFooter className="flex justify-end">
          <DialogClose asChild>
            <Button
              data-testid="fork-backup-cancel-button"
              type="button"
              mode="outline"
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
    </RouteModal>
  );
};

export default Fork;
