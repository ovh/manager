import { useParams } from 'react-router';
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
import { database } from '@/models/database';
import { GenericUser } from '@/api/databases/users';
import { useDeleteUser } from '@/hooks/api/users.api.hooks';

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
        description: err.message,
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
          <DialogTitle>{t('deleteUserTitle')}</DialogTitle>
          <DialogDescription>
            {t('deleteUserDescription', { name: user.username })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              {t('deleteUserButtonCancel')}
            </Button>
          </DialogClose>
          <Button type="button" disabled={isPending} onClick={handleDelete}>
            {t('deleteUserButtonConfirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteUser;
