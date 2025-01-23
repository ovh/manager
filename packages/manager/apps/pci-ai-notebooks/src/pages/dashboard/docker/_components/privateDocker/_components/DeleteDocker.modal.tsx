import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { useDeleteRegistry } from '@/hooks/api/ai/registry/useDeleteRegistry.hook';
import RouteModal from '@/components/route-modal/RouteModal';

const DeleteDocker = () => {
  const { projectId, dockerId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation('pci-ai-dashboard/docker');
  const toast = useToast();
  const { deleteRegistry, isPending } = useDeleteRegistry({
    onError: (err) => {
      toast.toast({
        title: t('deleteDockerToastErrorTitle'),
        variant: 'destructive',
        description: err.response.data.message,
      });
    },
    onDeleteSuccess: () => {
      toast.toast({
        title: t('deleteDockerToastSuccessTitle'),
        description: t('deleteDockerToastSuccessDescription', {
          id: dockerId,
        }),
      });
      navigate('../');
    },
  });

  const handleDelete = () => {
    deleteRegistry({
      projectId,
      registryId: dockerId,
    });
  };
  return (
    <RouteModal backUrl="../">
      <DialogContent>
        <DialogHeader>
          <DialogTitle data-testid="delete-docker-modal">
            {t('deleteDockerTitle')}
          </DialogTitle>
          <DialogDescription>
            {t('deleteDockerDescription', {
              id: dockerId,
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
    </RouteModal>
  );
};

export default DeleteDocker;
