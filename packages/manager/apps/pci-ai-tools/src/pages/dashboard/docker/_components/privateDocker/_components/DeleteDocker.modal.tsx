import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Button,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  useToast,
} from '@datatr-ux/uxlib';
import RouteModal from '@/components/route-modal/RouteModal';
import { useDeleteRegistry } from '@/data/hooks/ai/registry/useDeleteRegistry.hook';

const DeleteDocker = () => {
  const { projectId, dockerId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation('ai-tools/dashboard/docker');
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
              mode="outline"
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
