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
import { useDeleteRegistry } from '@/hooks/api/ai/registry/useDeleteRegistry.hook';

interface DeleteDockerModalProps {
  docker: ai.registry.Registry;
  controller: ModalController;
  onSuccess?: (docker: ai.registry.Registry) => void;
  onError?: (error: Error) => void;
}

const DeleteDocker = ({
  docker,
  controller,
  onError,
  onSuccess,
}: DeleteDockerModalProps) => {
  const { projectId } = useParams();
  const { t } = useTranslation('pci-ai-dashboard/docker');
  const toast = useToast();
  const { deleteRegistry, isPending } = useDeleteRegistry({
    onError: (err) => {
      toast.toast({
        title: t('deleteDockerToastErrorTitle'),
        variant: 'destructive',
        description: err.response.data.message,
      });
      if (onError) {
        onError(err);
      }
    },
    onSuccess: () => {
      toast.toast({
        title: t('deleteDockerToastSuccessTitle'),
        description: t('deleteDockerToastSuccessDescription', {
          id: docker.id,
        }),
      });
      if (onSuccess) {
        onSuccess(docker);
      }
    },
  });

  const handleDelete = () => {
    deleteRegistry({
      projectId,
      registryId: docker.id,
    });
  };
  return (
    <Dialog {...controller}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle data-testid="delete-docker-modal">
            {t('deleteDockerTitle')}
          </DialogTitle>
          <DialogDescription>
            {t('deleteDockerDescription', {
              id: docker.id,
            })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end">
          <DialogClose asChild>
            <Button
              data-testid="delete-docker-cancel-button"
              type="button"
              variant="outline"
            >
              {t('deleteDockerButtonCancel')}
            </Button>
          </DialogClose>
          <Button
            data-testid="delete-docker-submit-button"
            type="button"
            disabled={isPending}
            onClick={handleDelete}
          >
            {t('deleteDockerButtonConfirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDocker;
