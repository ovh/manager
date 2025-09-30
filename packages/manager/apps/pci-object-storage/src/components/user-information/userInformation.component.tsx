import { Button, Code, githubDark, useToast, yaml } from '@datatr-ux/uxlib';
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
  if (newUser.status !== user.UserStatusEnum.ok) {
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
    download(JSON.stringify(userData), `${newUser.username}.txt`);
  };
  return (
    <div className="space-y-4">
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
      <Code
        code={newUser.username}
        label={t('newUserUsernameLabel')}
        theme={githubDark}
        lang={yaml}
        onCopied={() =>
          toast.toast({
            title: t('passwordCopy'),
          })
        }
      />
      <Code
        code={newUser.description}
        label={t('newUserDescriptionLabel')}
        theme={githubDark}
        lang={yaml}
        onCopied={() =>
          toast.toast({
            title: t('passwordCopy'),
          })
        }
      />
      <Code
        code={newUser.openstackId}
        label={t('newUserAccessKeyLabel')}
        theme={githubDark}
        lang={yaml}
        onCopied={() =>
          toast.toast({
            title: t('passwordCopy'),
          })
        }
      />
      <Code
        code={pwd}
        label={t('newUserPwdLabel')}
        theme={githubDark}
        lang={yaml}
        onCopied={() =>
          toast.toast({
            title: t('passwordCopy'),
          })
        }
      />
    </div>
  );
};

export default UserInformation;
