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
  Code,
  githubDark,
} from '@datatr-ux/uxlib';
import { useState } from 'react';
import RouteModal from '@/components/route-modal/RouteModal';
import { getObjectStoreApiErrorMessage } from '@/lib/apiHelper';
import { useObjectStorageData } from '../../ObjectStorage.context';
import { useAddS3User } from '@/data/hooks/user/useAddS3User.hook';
import user from '@/types/User';

const EnableUser = () => {
  const { projectId, userId } = useParams();
  const { t } = useTranslation('pci-object-storage/users/enable');
  const [newUser, setNewUser] = useState<user.S3CredentialsWithSecret>();
  const { users } = useObjectStorageData();
  const toast = useToast();
  const userToUpate = users.find((us) => us.id === Number(userId));
  const navigate = useNavigate();
  if (!user) navigate('../');

  const { addS3User, isPending: isAddS3UserPending } = useAddS3User({
    onError: (err) => {
      toast.toast({
        title: t('enableUserToastErrorTitle'),
        variant: 'destructive',
        description: getObjectStoreApiErrorMessage(err),
      });
    },
    onSuccess: (newUserCreated: user.S3CredentialsWithSecret) => {
      toast.toast({
        title: t('enableUserToastSuccessTitle'),
        description: t('enableUserToastSuccessDescription', {
          name: userToUpate.username,
        }),
      });
      setNewUser(newUserCreated);
    },
  });

  const handleEnable = () => {
    addS3User({ projectId, userId: userToUpate.id });
  };

  const handleClose = () => {
    setNewUser(undefined);
    navigate('../');
  };

  return (
    <RouteModal isLoading={!userToUpate}>
      <DialogContent>
        <DialogHeader className="rounded-t-sm sm:rounded-t-lg ">
          <DialogTitle data-testid="enable-user-s3-modal">
            {t('enableUserTitle')}
          </DialogTitle>
        </DialogHeader>
        {newUser ? (
          <>
            <div className="flex flex-col gap-2">
              <Code
                code={newUser.access}
                label={t('accessKeyLabel')}
                theme={githubDark}
                onCopied={() =>
                  toast.toast({
                    title: t('passwordCopy'),
                  })
                }
              />
              <Code
                code={newUser.secret}
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
              <DialogClose asChild onClick={() => handleClose()}>
                <Button
                  data-testid="enable-user-close-button"
                  type="button"
                  mode="outline"
                >
                  {t('enableUserButtonClose')}
                </Button>
              </DialogClose>
            </DialogFooter>
          </>
        ) : (
          <>
            <p>
              {t('enableUSerDescription', {
                name: userToUpate?.username,
              })}
            </p>
            <DialogFooter className="flex justify-end">
              <DialogClose asChild>
                <Button
                  data-testid="enable-s3-cancel-button"
                  type="button"
                  mode="outline"
                >
                  {t('enableUserButtonCancel')}
                </Button>
              </DialogClose>
              <Button
                data-testid="enable-s3-submit-button"
                type="button"
                disabled={isAddS3UserPending}
                onClick={handleEnable}
              >
                {t('enableUserButtonConfirm')}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </RouteModal>
  );
};

export default EnableUser;
