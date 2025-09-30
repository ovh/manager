import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Button,
  useToast,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@datatr-ux/uxlib';
import { ArrowRight } from 'lucide-react';
import RouteModal from '@/components/route-modal/RouteModal';
import { getObjectStoreApiErrorMessage } from '@/lib/apiHelper';
import { useDeleteUser } from '@/data/hooks/user/useDeleteUser.hook';
import { useObjectStorageData } from '../../ObjectStorage.context';
import OvhLink from '@/components/links/OvhLink.component';

const DeleteUser = () => {
  const { projectId, userId } = useParams();
  const { t } = useTranslation('pci-object-storage/users/delete');
  const { users } = useObjectStorageData();
  const userPath = `#/pci/projects/${projectId}/users`;
  const toast = useToast();
  const user = users.find((us) => us.id === Number(userId));
  const navigate = useNavigate();
  if (!user) navigate('../');

  const { deleteUser, isPending } = useDeleteUser({
    onError: (err) => {
      toast.toast({
        title: t('deleteUserToastErrorTitle'),
        variant: 'destructive',
        description: getObjectStoreApiErrorMessage(err),
      });
    },
    onDeleteSuccess: () => {
      toast.toast({
        title: t('deleteUserToastSuccessTitle'),
        description: t('deleteUserToastSuccessDescription', {
          name: user.username,
        }),
      });
      navigate('../');
    },
  });

  const handleDelete = () => {
    deleteUser({ projectId, userId: user.id, accessKey: user.access_key });
  };

  return (
    <RouteModal isLoading={!user}>
      <DialogContent className="p-0">
        <DialogHeader className="bg-warning-100 p-6 rounded-t-sm sm:rounded-t-lg ">
          <DialogTitle data-testid="delete-storage-modal">
            {t('deleteUserTitle')}
          </DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <div className="in-line space-x-2">
            <span className="mt-2">{t('deleteUserDescription')}</span>
            <OvhLink
              className="hover:no-underline"
              application="public-cloud"
              path={userPath}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('deleteUSerDescription1')}
              <ArrowRight className="inline w-4 h-4" />
            </OvhLink>
          </div>
          <p>
            {t('deleteUSerDescription2', {
              name: user?.username,
            })}
          </p>
        </div>
        <DialogFooter className="flex justify-end p-6 pt-0">
          <DialogClose asChild>
            <Button
              data-testid="delete-storage-cancel-button"
              type="button"
              mode="outline"
            >
              {t('deleteUserButtonCancel')}
            </Button>
          </DialogClose>
          <Button
            data-testid="delete-storage-submit-button"
            type="button"
            disabled={isPending}
            onClick={handleDelete}
          >
            {t('deleteUserButtonConfirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </RouteModal>
  );
};

export default DeleteUser;
