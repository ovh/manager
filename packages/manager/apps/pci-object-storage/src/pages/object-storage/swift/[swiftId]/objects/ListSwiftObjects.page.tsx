import { useState, useMemo, useDeferredValue } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate } from 'react-router-dom';
import { Button, Skeleton } from '@datatr-ux/uxlib';
import { Plus } from 'lucide-react';
import { useSwiftData } from '../Swift.context';
import Guides from '@/components/guides/Guides.component';
import SwiftObjectBrowser from './_components/SwiftObjectBrowser.component';
import RefreshButton from '@/components/refresh-button/RefreshButton.component';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';
import SimpleSearchBar from '@/components/simple-search-bar/SimpleSearchBar.component';

const breadcrumb = () => (
  <BreadcrumbItem
    translationKey="objectsTab"
    namespace="pci-object-storage/storages/header-tabs"
  />
);

const ListSwiftObjects = () => {
  const { t } = useTranslation([
    'pci-object-storage/storages/swift/objects',
    'pci-object-storage/storages/s3/objects',
  ]);
  const { swiftQuery } = useSwiftData();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const objects = swiftQuery.data?.objects || [];

  const deferredSearchQuery = useDeferredValue(searchQuery);

  const filteredObjects = useMemo(() => {
    if (!deferredSearchQuery) return objects;
    const query = deferredSearchQuery.toLowerCase();
    return objects.filter((obj) => obj.name?.toLowerCase().includes(query));
  }, [objects, deferredSearchQuery]);

  if (swiftQuery.isLoading) return <Skeleton className="h-96 w-full" />;

  return (
    <>
      <div className="flex justify-between w-full items-center">
        <h2>{t('objectTitle')}</h2>
        <div className="flex flex-wrap justify-end gap-1">
          <Guides selectors={['allGuides', 'gettingStarted']} />
        </div>
      </div>

      <div className="flex justify-between w-full">
        <Button onClick={() => navigate('./add-object')}>
          <Plus className="size-6" />
          {t('addNewObject')}
        </Button>
        <div className="flex items-center space-x-2">
          <RefreshButton
            onClick={swiftQuery.refetch}
            isLoading={swiftQuery.isFetching}
          />
          <SimpleSearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder={t(
              'pci-object-storage/storages/s3/objects:searchPlaceholder',
            )}
          />
        </div>
      </div>

      <SwiftObjectBrowser objects={filteredObjects} />
      <Outlet />
    </>
  );
};

export { breadcrumb };
export default ListSwiftObjects;
