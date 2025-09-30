import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Code,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  githubDark,
  useToast,
} from '@datatr-ux/uxlib';
import RouteModal from '@/components/route-modal/RouteModal';
import { getObjectStoreApiErrorMessage } from '@/lib/apiHelper';
import { useObjectStorageData } from '../../ObjectStorage.context';
import { useGetUserSecret } from '@/data/hooks/user/useGetUserSecret.hook';
import user from '@/types/User';

const UserSecret = () => {
  const { t } = useTranslation('pci-object-storage/users/show-secret');
  const toast = useToast();
  const { projectId, userId } = useParams();
  const { users } = useObjectStorageData();
  const navigate = useNavigate();
  const currentUser = users.find((us) => us.id === Number(userId));
  if (!currentUser) navigate('../');
  const [secret, setSecret] = useState('');

  const { getUserSecret, isPending } = useGetUserSecret({
    onError: (err) => {
      toast.toast({
        title: t('getUserSecretToastErrorTitle'),
        variant: 'destructive',
        description: getObjectStoreApiErrorMessage(err),
      });
    },
    onSuccess: (sec: user.S3CredentialsSecretOnly) => {
      setSecret(sec.secret);
    },
  });

  useEffect(() => {
    getUserSecret({
      projectId,
      userId: currentUser.id,
      accessKey: currentUser.access_key,
    });
  }, []);

  return (
    <RouteModal isLoading={!user || isPending}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle data-testid="get-user-secret-modal">
            {t('secretTitle')}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2 p-2">
          <p>{t('accessKeyLabel')}</p>
          <Code
            code={currentUser.access_key}
            label={t('accessKeyLabel')}
            theme={githubDark}
            onCopied={() =>
              toast.toast({
                title: t('passwordCopy'),
              })
            }
          />
          <p>{t('secretKeyLabel')}</p>
          <Code
            code={secret}
            label={t('secretKeyLabel')}
            theme={githubDark}
            onCopied={() =>
              toast.toast({
                title: t('passwordCopy'),
              })
            }
          />
        </div>
        <DialogFooter className="flex justify-end">
          <DialogClose asChild>
            <Button type="button" mode="outline">
              {t('useSecretButtonClose')}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </RouteModal>
  );
};

export default UserSecret;
