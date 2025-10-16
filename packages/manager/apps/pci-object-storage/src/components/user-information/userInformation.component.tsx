import { Button, Clipboard, useToast } from '@datatr-ux/uxlib';
import { useTranslation } from 'react-i18next';
import { Download } from 'lucide-react';
import user from '@/types/User';
import Loading from '../loading/Loading.component';
import useDownload from '@/hooks/useDownload';

interface UserInformationProps {
  newUser: user.User;
  pwd: string;
}
const UserInformation = ({ newUser, pwd }: UserInformationProps) => {
  const { t } = useTranslation('pci-object-storage/users/create');
  const toast = useToast();
  const { download } = useDownload();
  const onCopy = () =>
    toast.toast({
      title: t('passwordCopy'),
    });
  if (newUser?.status !== user.UserStatusEnum.ok) {
    return (
      <div>
        <p>{t('newUserCreationInProgress')}</p>
        <Loading />
      </div>
    );
  }

  const HandHeDownload = () => {
    const userData = {
      userName: newUser.username,
      description: newUser.description,
      accessKey: newUser.openstackId,
      password: pwd,
    };
    download(
      { type: 'raw', data: JSON.stringify(userData) },
      `${newUser.username}.txt`,
    );
  };
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row justify-between">
        <h5>{t('newUserInformationTitle')}</h5>
        <Button
          data-testid="download-user-button"
          type="button"
          mode="outline"
          className="h-6"
          onClick={() => HandHeDownload()}
        >
          {t('downloadUserButton')}
          <Download className=" ml-2 w-4 h-4" />
        </Button>
      </div>
      <p>{t('newUserInformationLabel', { name: newUser.username })}</p>
      <span className="text-sm font-medium leading-none">
        {t('newUserUsernameLabel')}
      </span>
      <Clipboard value={newUser.username} onCopy={onCopy} />
      <span className="text-sm font-medium leading-none">
        {t('newUserDescriptionLabel')}
      </span>
      <Clipboard value={newUser.description} onCopy={onCopy} />
      <span className="text-sm font-medium leading-none">
        {t('newUserAccessKeyLabel')}
      </span>
      <Clipboard value={newUser.openstackId} onCopy={onCopy} secret />
      <span className="text-sm font-medium leading-none">
        {t('newUserPwdLabel')}
      </span>
      <Clipboard value={newUser.openstackId} onCopy={onCopy} secret />
    </div>
  );
};

export default UserInformation;
