import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
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
import { useDeleteUser } from '@/hooks/api/database/user/useDeleteUser.hook';
import { getCdbApiErrorMessage } from '@/lib/apiHelper';
import { useServiceData } from '../../Service.context';
import { useGetUsers } from '@/hooks/api/database/user/useGetUsers.hook';
import RouteModal from '@/components/route-modal/RouteModal';

const DeleteUser = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { projectId, service } = useServiceData();
  const usersQuery = useGetUsers(projectId, service?.engine, service.id, {
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

  const handleDelete = () => {
    deleteUser({
      serviceId: service.id,
      projectId,
      engine: service.engine,
      userId: deletedUser.id,
    });
  };

  return (
    <RouteModal isLoading={!users || !deletedUser}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle data-testid="delete-user-modal">
            {t('deleteUserTitle')}
          </DialogTitle>
          <DialogDescription>
            {t('deleteUserDescription', { name: deletedUser?.username })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end">
          <DialogClose asChild>
            <Button
              type="button"
              mode="outline"
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
    </RouteModal>
  );
};

export default DeleteUser;
