import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { ModalController } from '@/hooks/useModale.hook';
import * as ai from '@/types/cloud/project/ai';
import { useDeleteDatastore } from '@/hooks/api/ai/datastore/useDeleteDatastore.hook';
import { DataStoresWithRegion } from '@/hooks/api/ai/datastore/useGetDatastoresWithRegions.hook';

interface DeleteGitModalProps {
  git: DataStoresWithRegion;
  controller: ModalController;
  onSuccess?: (datastore: ai.DataStore) => void;
  onError?: (error: Error) => void;
}

const DeleteGit = ({
  git,
  controller,
  onError,
  onSuccess,
}: DeleteGitModalProps) => {
  const { projectId } = useParams();
  const { t } = useTranslation('pci-ai-dashboard/git');
  const toast = useToast();
  const { deleteDatastore, isPending } = useDeleteDatastore({
    onError: (err) => {
      toast.toast({
        title: t('deleteGitToastErrorTitle'),
        variant: 'destructive',
        description: err.response.data.message,
      });
      if (onError) {
        onError(err);
      }
    },
    onSuccess: () => {
      toast.toast({
        title: t('deleteGitToastSuccessTitle'),
        description: t('deleteGitToastSuccessDescription', {
          alias: git.alias,
        }),
      });
      if (onSuccess) {
        onSuccess(git);
      }
    },
  });

  const handleDelete = () => {
    deleteDatastore({
      projectId,
      region: git.region,
      alias: git.alias,
    });
  };
  return (
    <Dialog {...controller}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle data-testid="delete-git-modal">
            {t('deleteGitTitle')}
          </DialogTitle>
          <DialogDescription>
            {t('deleteGitDescription', {
              alias: git.alias,
            })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end">
          <DialogClose asChild>
            <Button
              data-testid="delete-git-cancel-button"
              type="button"
              variant="outline"
            >
              {t('deleteGitButtonCancel')}
            </Button>
          </DialogClose>
          <Button
            data-testid="delete-git-submit-button"
            type="button"
            disabled={isPending}
            onClick={handleDelete}
          >
            {t('deleteGitButtonConfirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteGit;
