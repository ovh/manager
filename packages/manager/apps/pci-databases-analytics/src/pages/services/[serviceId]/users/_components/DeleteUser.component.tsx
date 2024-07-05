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
import { ModalController } from '@/hooks/useModale';
import { useToast } from '@/components/ui/use-toast';
import * as database from '@/types/cloud/project/database';
import { GenericUser } from '@/data/api/database/user.api';
import { useDeleteUser } from '@/hooks/api/database/user/useDeleteUser.hook';
import { getCdbApiErrorMessage } from '@/lib/apiHelper';

interface DeleteUserModalProps {
  service: database.Service;
  controller: ModalController;
  user: GenericUser;
  onSuccess?: (user: GenericUser) => void;
  onError?: (error: Error) => void;
}

const DeleteUser = ({
  service,
  user,
  controller,
  onError,
  onSuccess,
}: DeleteUserModalProps) => {
  const { projectId } = useParams();
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/users',
  );
  const toast = useToast();
  const { deleteUser, isPending } = useDeleteUser({
    onError: (err) => {
      toast.toast({
        title: t('deleteUserToastErrorTitle'),
        variant: 'destructive',
        description: getCdbApiErrorMessage(err),
      });
      if (onError) {
        onError(err);
      }
    },
    onSuccess: () => {
      toast.toast({
        title: t('deleteUserToastSuccessTitle'),
        description: t('deleteUserToastSuccessDescription', {
          name: user.username,
        }),
      });
      if (onSuccess) {
        onSuccess(user);
      }
    },
  });

  const handleDelete = () => {
    deleteUser({
      serviceId: service.id,
      projectId,
      engine: service.engine,
      userId: user.id,
    });
  };

  return (
    <Dialog {...controller}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle data-testid="delete-user-modal">
            {t('deleteUserTitle')}
          </DialogTitle>
          <DialogDescription>
            {t('deleteUserDescription', { name: user.username })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              data-testid="delete-user-cancel-button"
            >
              {t('deleteUserButtonCancel')}
            </Button>
          </DialogClose>
          <Button
            type="button"
            disabled={isPending}
            onClick={handleDelete}
            data-testid="delete-user-submit-button"
          >
            {t('deleteUserButtonConfirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteUser;
