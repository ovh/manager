import { Skeleton } from '@/components/ui/skeleton';
import { useGetFlavorsWithRegionsAndReftch } from '@/hooks/api/ai/useGetFlavors';
import { useGetRegions } from '@/hooks/api/ai/useGetRegions';
import { useGetCatalog } from '@/hooks/api/catalog.api.hooks';
import { useGetCloudRegions } from '@/hooks/api/cloud/regionCloud.api.hooks';
import { useGetSSHKeyWithRegions } from '@/hooks/api/cloud/sshKey.api.hooks';
import { useGetNbCapaEditor } from '@/hooks/api/notebooks/useGetNbEditors';
import { useGetNbCapaFrameworks } from '@/hooks/api/notebooks/useGetNbFrameworks';
import { useRequiredParams } from '@/hooks/useRequiredParams';
import { ai } from '@/models/types';
import { useEffect, useState } from 'react';
import OrderFunnel from './_components/order-funnel';

export function breadcrumb() {
  return 'New';
}

const OrderNotebook = () => {
  debugger;
  const { projectId } = useRequiredParams<{ projectId: string }>();
  const [cloudRegions, setCloudRegions] = useState<string[]>([]);
  const [regions, setRegions] = useState<ai.capabilities.Region[]>([]);
  const regionsQuery = useGetRegions(projectId);
  const editorsQuery = useGetNbCapaEditor(projectId);
  const cloudRegionQuery = useGetCloudRegions(projectId);
  const frameworksQuery = useGetNbCapaFrameworks(projectId);
  const flavorsQueries = useGetFlavorsWithRegionsAndReftch(projectId, regions);
  // const sshKeysQueries = useGetSSHKeyWithRegions(projectId, cloudRegions);

  const catalogQuery = useGetCatalog();
  const loading =
    regionsQuery.isLoading ||
    editorsQuery.isLoading ||
    frameworksQuery.isLoading ||
    catalogQuery.isLoading;

  useEffect(() => {
    if (!cloudRegionQuery.data) return;
    setCloudRegions(cloudRegionQuery.data);
  });
  useEffect(() => {
    if (!regionsQuery.data) return;
    setRegions(regionsQuery.data);
  });

  return (
    <>
      {loading ? (
        <Skeleton className="h-4 w-32" />
      ) : (
        <OrderFunnel
          frameworks={frameworksQuery.data}
          editors={editorsQuery.data}
          regions={regionsQuery.data}
          flavorsWithRegion={flavorsQueries.flavorsWithRegion}
          catalog={catalogQuery.data}
        />
      )}
    </>
  );
};
export default OrderNotebook;
