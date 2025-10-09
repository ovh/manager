import { Card, CardContent, CardHeader } from '@datatr-ux/uxlib';
import { Archive, FileKey, Tag } from 'lucide-react';
import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import BucketOverview from './_components/BucketOverview.components';
import Encryption from './_components/Encryption.component';
import Tags from './_components/Tags.component';

const Dashboard = () => {
  const { t } = useTranslation('pci-object-storage/storages/s3/dashboard');
  return (
    <>
      <h2>{t('dashboardTitle')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <h4>
              <Archive className="size-4 inline mr-2" />
              <span>{t('overviewTitle')}</span>
            </h4>
          </CardHeader>
          <CardContent>
            <BucketOverview />
          </CardContent>
        </Card>
        <div>
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
          <Card className="mt-2">
            <CardHeader>
              <h4>
                <Tag className="size-4 inline mr-2" />
                <span>{t('tagsTitle')}</span>
              </h4>
            </CardHeader>
            <CardContent>
              <Tags />
            </CardContent>
          </Card>
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default Dashboard;
