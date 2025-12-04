import React from 'react';

import { Outlet } from 'react-router-dom';

import { useVcdDatacentre, useVcdOrganization } from '@ovh-ux/manager-module-vcd-api';

import Loading from '@/components/loading/Loading.component';
import { AsyncFallback } from '@/components/query/AsyncFallback.component';
import DatacentreGenerationInformationTile from '@/components/tiles/datacentre-general-information-tile/DatacentreGeneralInformationTile.component';
import { useDatacentreParams } from '@/hooks/params/useSafeParams';

export default function DatacentresGeneralInformationPage() {
  const { id, vdcId } = useDatacentreParams();
  const {
    data: vcdOrganization,
    isLoading: isLoadingVcd,
    error: vcdError,
  } = useVcdOrganization({
    id,
  });
  const {
    data: vcdDatacentre,
    isLoading: isLoadingDatacentre,
    error: datacentreError,
  } = useVcdDatacentre(id, vdcId);

  const queryError = vcdError || datacentreError;
  const emptyData = !vcdDatacentre?.data || !vcdOrganization?.data;

  if (isLoadingVcd || isLoadingDatacentre) return <AsyncFallback state="loading" />;
  if (queryError) return <AsyncFallback state="error" error={queryError} />;
  if (emptyData) return <AsyncFallback state="emptyError" />;

  return (
    <React.Suspense fallback={<Loading />}>
      <div className="grid gap-8 px-10 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        <DatacentreGenerationInformationTile
          vcdDatacentre={vcdDatacentre.data}
          vcdOrganization={vcdOrganization.data}
        />
      </div>
      <Outlet />
    </React.Suspense>
  );
}
