import { useParams } from 'react-router-dom';
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
import { getObjectStoreApiErrorMessage } from '@/lib/apiHelper';
import { useGetUserSecret } from '@/data/hooks/user/useGetUserSecret.hook';
import * as Tuser from '@/types/User';
import { UserWithS3Credentials } from '@/data/hooks/user/useGetUsersWithS3Credentials.hook';

interface SecretKeyProps {
  user: UserWithS3Credentials;
}
const UserSecretKey = ({ user }: SecretKeyProps) => {
  const { t } = useTranslation('pci-object-storage/users/show-secret');
  const toast = useToast();
  const { projectId } = useParams();
  const [secret, setSecret] = useState('');

  const { getUserSecret } = useGetUserSecret({
    onError: (err) => {
      toast.toast({
        title: t('getUserSecretToastErrorTitle'),
        variant: 'destructive',
        description: getObjectStoreApiErrorMessage(err),
      });
    },
    onSuccess: (sec: Tuser.default.S3CredentialsSecretOnly) => {
      setSecret(sec.secret);
    },
  });

  useEffect(() => {
    getUserSecret({
      projectId,
      userId: user.id,
      accessKey: user.access_key,
    });
  }, []);

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle data-testid="get-user-secret-modal">
          {t('secretTitle')}
        </DialogTitle>
      </DialogHeader>
      <div className="flex flex-col gap-2 p-2">
        <p>{t('accessKeyLabel')}</p>
        <Code
          code={user.access_key}
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
  );
};

export default UserSecretKey;
