import { Outlet, redirect, useParams } from 'react-router-dom';
import { Skeleton } from '@datatr-ux/uxlib';
import TabsMenu from '@/components/tabs-menu/TabsMenu.component';
import { POLLING } from '@/configuration/polling.constants';
import queryClient from '@/query.client';
import { useUserActivityContext } from '@/contexts/UserActivityContext';
import { SwiftHeader } from './_components/SwiftHeader.component';
import S3Tabs from './_components/SwiftTabs.component';
import { getSwiftStorage } from '@/data/api/storage/swiftStorage.api';
import { useGetSwift } from '@/data/hooks/swift-storage/useGetSwift.hook';
import { SwiftLayoutContext } from './Swift.context';
import Dashboard from './dashboard/Dashboard.page';

interface SwiftLayoutProps {
  params: {
    projectId: string;
    swiftId: string;
  };
  request: Request;
}
// try to fetch the service data, redirect to service page if it fails
export const Loader = async ({ params }: SwiftLayoutProps) => {
  const { projectId, swiftId } = params;
  return queryClient
    .fetchQuery({
      queryKey: [projectId, 'storages', swiftId],
      queryFn: () =>
        getSwiftStorage({ projectId, containerId: swiftId, noObjects: false }),
    })
    .then(
      () => true,
      () => redirect(`/pci/projects/${projectId}/storages/objects`),
    );
};

function SwiftName() {
  const { projectId, swiftId } = useParams();
  if (!swiftId) return '';
  const swiftQuery = useGetSwift({
    projectId,
    containerId: swiftId,
    noObjects: true,
  });
  return swiftQuery.isSuccess ? (
    swiftQuery.data.name
  ) : (
    <Skeleton className="h-4 w-20 inline-block align-middle" />
  );
}

export function breadcrumb() {
  return <SwiftName />;
}

export default function SwiftLayout() {
  const { isUserActive } = useUserActivityContext();
  const { projectId, swiftId } = useParams();
  const swiftQuery = useGetSwift({
    projectId,
    containerId: swiftId,
    noObjects: false,
    options: {
      refetchInterval: isUserActive && POLLING.S3,
    },
  });

  const swift = swiftQuery.data;
  if (!swift) {
    return (
      <>
        <SwiftHeader.Skeleton />
        <TabsMenu.Skeleton />
        <Dashboard.Skeleton />
      </>
    );
  }
  const swiftLayoutContext: SwiftLayoutContext = {
    swift,
    swiftQuery,
  };

  return (
    <>
      <SwiftHeader swift={swift} />
      <S3Tabs swift={swift} />
      <div className="space-y-2">
        <Outlet context={swiftLayoutContext} />
      </div>
    </>
  );
}
