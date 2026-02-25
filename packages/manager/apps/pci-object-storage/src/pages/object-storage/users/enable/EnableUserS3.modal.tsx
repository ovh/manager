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
  Clipboard,
  DialogBody,
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
  const { addS3User, isPending: isAddS3UserPending } = useAddS3User({
    onError: (err) => {
      toast.toast({
        title: t('enableUserToastErrorTitle'),
        variant: 'critical',
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

  if (!user) navigate('../');
  const handleEnable = () => {
    addS3User({ projectId, userId: userToUpate.id });
  };
  const handleClose = () => {
    setNewUser(undefined);
    navigate('../');
  };

  return (
    <RouteModal isLoading={!userToUpate}>
      <DialogContent variant="information">
        <DialogHeader>
          <DialogTitle data-testid="enable-user-s3-modal">
            {t('enableUserTitle')}
          </DialogTitle>
        </DialogHeader>
        {newUser ? (
          <>
            <DialogBody>
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium leading-none">
                  {t('accessKeyLabel')}
                </span>
                <Clipboard
                  value={newUser.access}
                  onCopy={() =>
                    toast.toast({
                      title: t('passwordCopy'),
                    })
                  }
                />
                <span className="text-sm font-medium leading-none">
                  {t('secretKeyLabel')}
                </span>
                <Clipboard
                  value={newUser.secret}
                  secret
                  onCopy={() =>
                    toast.toast({
                      title: t('passwordCopy'),
                    })
                  }
                />
              </div>
            </DialogBody>
            <DialogFooter className="flex justify-end">
              <DialogClose asChild onClick={() => handleClose()}>
                <Button
                  data-testid="enable-user-close-button"
                  type="button"
                  mode="ghost"
                >
                  {t('enableUserButtonClose')}
                </Button>
              </DialogClose>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogBody>
              <p>
                {t('enableUSerDescription', {
                  name: userToUpate?.username,
                })}
              </p>
            </DialogBody>
            <DialogFooter className="flex justify-end">
              <DialogClose asChild>
                <Button
                  data-testid="enable-s3-cancel-button"
                  type="button"
                  mode="ghost"
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
