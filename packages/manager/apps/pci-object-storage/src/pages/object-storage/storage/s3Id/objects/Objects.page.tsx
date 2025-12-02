import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  Label,
  Skeleton,
  Switch,
  Alert,
  AlertDescription,
} from '@datatr-ux/uxlib';
import { useState, useMemo, useDeferredValue } from 'react';
import { Plus } from 'lucide-react';
import { useS3Data } from '../S3.context';
import { useGetS3Objects } from '@/data/hooks/s3-storage/useGetS3Objects.hook';
import Guides from '@/components/guides/Guides.component';
import S3ObjectBrowser from './_components/S3ObjectBrowser.component';
import { useObjectStorageData } from '@/pages/object-storage/ObjectStorage.context';
import { useIsLocaleZone } from '@/hooks/useIsLocalZone.hook';
import SearchBar from './_components/SearchBar.component';
import RefreshButton from '@/components/refresh-button/RefreshButton.component';

const Objects = () => {
  const { projectId } = useParams();
  const { s3 } = useS3Data();
  const { regions } = useObjectStorageData();
  const isLocaleZone = useIsLocaleZone(s3, regions);
  const { t } = useTranslation('pci-object-storage/storages/s3/objects');
  const [withVersion, setWithVersion] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const objectQuery = useGetS3Objects({
    projectId,
    region: s3.region,
    name: s3.name,
    withVersions: withVersion,
  });
  const navigate = useNavigate();

  const objects = objectQuery.data || [];

  const deferredSearchQuery = useDeferredValue(searchQuery);

  const filteredObjects = useMemo(() => {
    if (!deferredSearchQuery) return objects;
    const query = deferredSearchQuery.toLowerCase();
    return objects.filter((obj) => obj.key?.toLowerCase().includes(query));
  }, [objects, deferredSearchQuery]);

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
      <div
        data-testid="containers-guides-container"
        className="flex justify-between w-full items-center"
      >
        <h2>{t('objectTitle')}</h2>
        <div className="flex flex-wrap justify-end gap-1">
          <Guides selectors={['allGuides', 'gettingStarted']} />
        </div>
      </div>

      <div className="flex justify-between">
        <Button onClick={() => navigate('./add-object')}>
          <Plus className="size-6" />
          {t('addNewObject')}
        </Button>
        <div className="flex items-center space-x-2">
          <RefreshButton
            onClick={objectQuery.refetch}
            isLoading={objectQuery.isFetching}
          />
          {!isLocaleZone && (
            <>
              <Switch
                id="versions"
                checked={withVersion}
                onCheckedChange={setWithVersion}
              />
              <Label htmlFor="versions">{t('seeVersionsSwitchLabel')}</Label>
              <SearchBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                deferredSearchQuery={deferredSearchQuery}
                filteredObjects={filteredObjects}
                placeholder={t('searchPlaceholder') || 'Search...'}
              />
            </>
          )}
        </div>
      </div>
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
