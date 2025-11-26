import { Outlet } from 'react-router-dom';
import { Skeleton } from '@datatr-ux/uxlib';
import { useMemo } from 'react';
import { useSwiftData } from '../Swift.context';
import SwiftObjectBrowser from './_components/SwiftObjectBrowser.component';
import ObjectsPageHeader from '@/components/objects-page-header/ObjectsPageHeader.component';

const SwiftObjectsPage = () => {
  const { swiftQuery } = useSwiftData();

  if (swiftQuery.isLoading) return <Skeleton className="h-96 w-full" />;

  const objects = swiftQuery.data.objects || [];

  const normalizedObjects = useMemo(
    () => objects.map((obj) => ({ key: obj.name })),
    [objects],
  );

  return (
    <>
      <ObjectsPageHeader objects={normalizedObjects} />
      <SwiftObjectBrowser objects={objects} />
      <Outlet />
    </>
  );
};

export default SwiftObjectsPage;
