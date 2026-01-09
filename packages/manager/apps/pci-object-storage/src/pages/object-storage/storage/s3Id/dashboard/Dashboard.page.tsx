import { Badge, Card, CardContent, CardHeader } from '@datatr-ux/uxlib';
import { Archive, FileKey, FileStack, FolderLock, Tag } from 'lucide-react';
import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import BucketOverview from './_components/BucketOverview.components';
import Tags from './_components/Tags.component';
import Guides from '@/components/guides/Guides.component';
import Encryption from './_components/Encryption.component';
import Versionning from './_components/Versionning.component';
import ObjectLock from './_components/ObjectLock.component';
import { useS3Data } from '../S3.context';
import { useIsLocaleZone } from '@/hooks/useIsLocalZone.hook';
import { useObjectStorageData } from '@/pages/object-storage/ObjectStorage.context';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';

export function breadcrumb() {
  return (
    <BreadcrumbItem
      translationKey="dashboardTab"
      namespace="pci-object-storage/storages/header-tabs"
    />
  );
}

const Dashboard = () => {
  const { s3 } = useS3Data();
  const { regions } = useObjectStorageData();
  const isLocaleZone = useIsLocaleZone(s3, regions);
  const { t } = useTranslation('pci-object-storage/storages/s3/dashboard');
  return (
    <>
      <div className="flex justify-between w-full items-center">
        <h2>{t('dashboardTitle')}</h2>
        <Guides />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="w-full">
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
        <div className="space-y-2">
          {!isLocaleZone && (
            <Card className="w-full">
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
          )}
          <Card className="w-full">
            <CardHeader>
              <h4>
                <FolderLock className="size-4 inline mr-2" />
                <span>{t('objectLockTitle')}</span>
              </h4>
            </CardHeader>
            <CardContent>
              <ObjectLock />
            </CardContent>
          </Card>
          <Card className="w-full">
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
        </div>
      </div>
      {!isLocaleZone && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="w-full">
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
          <Card className="w-full" data-testid="access-logs-card">
            <CardHeader>
              <h4>{t('accessLogsTitle')}</h4>
            </CardHeader>
            <CardContent>
              <Badge variant="neutral">{t('comingSoonLabel')}</Badge>
            </CardContent>
          </Card>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="w-full" data-testid="lifecycle-card">
          <CardHeader>
            <h4>{t('lifecycleTitle')}</h4>
          </CardHeader>
          <CardContent>
            <Badge variant="neutral">{t('comingSoonLabel')}</Badge>
          </CardContent>
        </Card>
        {!isLocaleZone && (
          <Card className="w-full" data-testid="static-website-hosting-card">
            <CardHeader>
              <h4>{t('staticWebsiteHostingTitle')}</h4>
            </CardHeader>
            <CardContent>
              <Badge variant="neutral">{t('comingSoonLabel')}</Badge>
            </CardContent>
          </Card>
        )}
      </div>
      <Outlet />
    </>
  );
};

export default Dashboard;
