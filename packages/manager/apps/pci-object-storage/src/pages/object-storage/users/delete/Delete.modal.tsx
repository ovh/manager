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
  DialogBody,
} from '@datatr-ux/uxlib';
import { ArrowUpRightFromSquare } from 'lucide-react';
import RouteModal from '@/components/route-modal/RouteModal';
import { getObjectStoreApiErrorMessage } from '@/lib/apiHelper';
import { useDeleteUser } from '@/data/hooks/user/useDeleteUser.hook';
import { useObjectStorageData } from '../../ObjectStorage.context';
import OvhLink from '@/components/links/OvhLink.component';
import { useGetUserS3Credentials } from '@/data/hooks/user/useGetUserS3Credentials.hook';

const DeleteUser = () => {
  const { projectId, userId } = useParams();
  const { t } = useTranslation('pci-object-storage/users/delete');
  const { users } = useObjectStorageData();
  const toast = useToast();
  const user = users.find((us) => us.id === Number(userId));
  const credsQuery = useGetUserS3Credentials(projectId, user.id, {
    enabled: !!user.id,
  });
  const navigate = useNavigate();
  const { deleteUser, isPending } = useDeleteUser({
    onError: (err) => {
      toast.toast({
        title: t('deleteUserToastErrorTitle'),
        variant: 'critical',
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

  if (!user) navigate('../');

  const userPath = `#/pci/projects/${projectId}/users`;
  const handleDelete = () => {
    deleteUser({
      projectId,
      userId: user.id,
      accessKey: credsQuery.data?.[0]?.access,
    });
  };

  return (
    <RouteModal isLoading={!user || !credsQuery.data}>
      <DialogContent variant="warning">
        <DialogHeader>
          <DialogTitle data-testid="delete-user-modal">
            {t('deleteUserTitle')}
          </DialogTitle>
        </DialogHeader>
        <DialogBody>
          <div className="inline">
            <span className="mt-2">{t('deleteUserDescription')}</span>
            <OvhLink
              className="hover:no-underline flex flex-row items-center"
              application="public-cloud"
              path={userPath}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('deleteUSerDescription1')}
              <ArrowUpRightFromSquare className="inline size-3 ml-2" />
            </OvhLink>
          </div>
          <p className="mt-2">
            {t('deleteUSerDescription2', {
              name: user?.username,
            })}
          </p>
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              data-testid="delete-user-cancel-button"
              type="button"
              mode="ghost"
            >
              {t('deleteUserButtonCancel')}
            </Button>
          </DialogClose>
          <Button
            data-testid="delete-user-submit-button"
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
