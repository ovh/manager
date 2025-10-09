import {
  Card,
  CardContent,
  CardHeader,
  Code,
  Skeleton,
  docker,
} from '@datatr-ux/uxlib';
import { useTranslation } from 'react-i18next';
import { Globe2 } from 'lucide-react';
import { Outlet, useParams } from 'react-router-dom';
import { useObjectStorageData } from '@/pages/object-storage/ObjectStorage.context';
import { useGetS3Object } from '@/data/hooks/s3-storage/useGetS3Object.hook';

const Object = () => {
  const { projectId, region, s3Name, objectKey } = useParams();
  const objectQuery = useGetS3Object({
    projectId,
    region,
    name: s3Name,
    key: objectKey,
  });

  const { regions } = useObjectStorageData();
  const { t } = useTranslation('pci-object-storage/storages/swift');

  if (!regions) return <Object.Skeleton />;
  return (
    <>
      <h2>{t('ObjectTitle')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <h5>
              <Globe2 className="size-4 inline mr-2" />
              <span>{t('informationTitle')}</span>
            </h5>
          </CardHeader>
          <CardContent>
            <Code code={JSON.stringify(objectQuery.data)} lang={docker}></Code>
          </CardContent>
        </Card>
        <div className="bg-gray-100 p-4">
          <Card>
            <CardHeader>
              <h5>
                <Globe2 className="size-4 inline mr-2" />
                <span>{t('versionsTitle')}</span>
              </h5>
            </CardHeader>
            <CardContent>
              <p>Nombre de versions</p>
              <p>Poids des versions</p>
              <p>Manage my versions</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <h5>
                <Globe2 className="size-4 inline mr-2" />
                <span>{t('objectLockTitle')}</span>
              </h5>
            </CardHeader>
            <CardContent>
              <p>ObjectLockInfo</p>
              <p>IsLock</p>
              <p>Manage Lock</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Outlet />
    </>
  );
};

Object.Skeleton = function DashboardSkeleton() {
  return (
    <>
      <h2>Object</h2>
      <div className="flex space-x-4">
        <Skeleton className="w-full h-[200px]" />
      </div>
    </>
  );
};

export default Object;
