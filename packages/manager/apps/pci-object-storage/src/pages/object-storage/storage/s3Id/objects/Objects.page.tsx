import { useTranslation } from 'react-i18next';
import { Outlet, useParams } from 'react-router-dom';
import {
  Skeleton,
  Alert,
  AlertDescription,
  Switch,
  Label,
} from '@datatr-ux/uxlib';
import { useState } from 'react';
import { useS3Data } from '../S3.context';
import { useGetS3Objects } from '@/data/hooks/s3-storage/useGetS3Objects.hook';
import S3ObjectBrowser from './_components/S3ObjectBrowser.component';
import { useObjectStorageData } from '@/pages/object-storage/ObjectStorage.context';
import { useIsLocaleZone } from '@/hooks/useIsLocalZone.hook';
import ObjectsPageHeader from '@/components/objects-page-header/ObjectsPageHeader.component';

const Objects = () => {
  const { projectId } = useParams();
  const { s3 } = useS3Data();
  const { regions } = useObjectStorageData();
  const isLocaleZone = useIsLocaleZone(s3, regions);
  const { t } = useTranslation('pci-object-storage/storages/s3/objects');
  const [withVersion, setWithVersion] = useState(false);

  const objectQuery = useGetS3Objects({
    projectId,
    region: s3.region,
    name: s3.name,
    withVersions: withVersion,
  });

  const objects = objectQuery.data || [];

  if (objectQuery.isLoading) return <Objects.Skeleton />;

  if (objectQuery.isError) {
    return (
      <Alert variant="critical">
        <AlertDescription>
          {t('errorLoadingObjects') ||
            'An error occurred while loading objects'}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      <ObjectsPageHeader objects={objects}>
        {!isLocaleZone && (
          <>
            <Switch
              id="versions"
              checked={withVersion}
              onCheckedChange={setWithVersion}
            />
            <Label htmlFor="versions">{t('seeVersionsSwitchLabel')}</Label>
          </>
        )}
      </ObjectsPageHeader>
      <S3ObjectBrowser
        objects={objects}
        isLocaleZone={isLocaleZone}
        showVersion={withVersion}
      />
      <Outlet />
    </>
  );
};

Objects.Skeleton = function ObjectsListSkeleton() {
  return (
    <>
      <div
        data-testid="service-list-table-skeleton"
        className="flex justify-between w-100 mb-2 items-end"
      >
        <Skeleton className="h-10 w-48" />
        <div className="flex">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-12 ml-2" />
        </div>
      </div>
      <Skeleton className="w-full h-[60vh]" />
    </>
  );
};

export default Objects;
