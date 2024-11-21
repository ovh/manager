import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
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
import { useDeleteUser } from '@/hooks/api/database/user/useDeleteUser.hook';
import { getCdbApiErrorMessage } from '@/lib/apiHelper';
import { useServiceData } from '../../Service.context';
import { useGetUsers } from '@/hooks/api/database/user/useGetUsers.hook';
import { Skeleton } from '@/components/ui/skeleton';

const DeleteUser = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { projectId, service } = useServiceData();
  const usersQuery = useGetUsers(projectId, service.engine, service.id, {
    enabled: !!service.id,
  });
  const users = usersQuery.data;
  const deletedUser = users?.find((u) => u.id === userId);

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
    },
    onSuccess: () => {
      toast.toast({
        title: t('deleteUserToastSuccessTitle'),
        description: t('deleteUserToastSuccessDescription', {
          name: deletedUser.username,
        }),
      });
      navigate('../');
    },
  });

  useEffect(() => {
    if (users && !deletedUser) navigate('../');
  }, [users, deletedUser]);

  if (!users || !deletedUser) return <Skeleton className="w-full h-4" />;

  const handleDelete = () => {
    deleteUser({
      serviceId: service.id,
      projectId,
      engine: service.engine,
      userId: deletedUser.id,
    });
  };

  const onOpenChange = (open: boolean) => {
    if (!open) navigate('../');
  };

  return (
    <Dialog defaultOpen onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle data-testid="delete-user-modal">
            {t('deleteUserTitle')}
          </DialogTitle>
          <DialogDescription>
            {t('deleteUserDescription', { name: deletedUser.username })}
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
