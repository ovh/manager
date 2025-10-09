import { Badge, Card, CardContent, CardHeader } from '@datatr-ux/uxlib';
import { FileKey, FileStack } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';
import Encryption from './_components/Encryption.component';
import Versionning from './_components/Versionning.component';

const Settings = () => {
  const { t } = useTranslation('pci-object-storage/storages/s3/settings');
  return (
    <>
      <h2>{t('settingsTitle')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Card>
            <CardHeader>
              <h4>
                <FileStack className="size-4 inline mr-2" />
                <span>{t('versionningTitle')}</span>
              </h4>
            </CardHeader>
            <CardContent>
              <Versionning />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <h4>{t('objectLockTitle')}</h4>
            </CardHeader>
            <CardContent>
              <Badge variant={'neutral'}>{t('comingSoonLabel')}</Badge>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-2">
          <Card>
            <CardHeader>
              <h4>
                <FileKey className="size-4 inline mr-2" />
                <span>{t('encryptionTitle')}</span>
              </h4>
            </CardHeader>
            <CardContent>
              <Encryption />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <h4>{t('staticHostingTitle')}</h4>
            </CardHeader>
            <CardContent>
              <Badge variant={'neutral'}>{t('comingSoonLabel')}</Badge>
            </CardContent>
          </Card>
        </div>
      </div>

      <Outlet />
    </>
  );
};

export default Settings;
