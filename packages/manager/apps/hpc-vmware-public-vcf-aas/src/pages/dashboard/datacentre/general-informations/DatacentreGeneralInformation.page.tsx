import React from 'react';

import { Outlet } from 'react-router-dom';

import { useVcdDatacentre, useVcdOrganization } from '@ovh-ux/manager-module-vcd-api';

import Errors from '@/components/error/Error.component';
import Loading from '@/components/loading/Loading.component';
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

  if (isLoadingVcd || isLoadingDatacentre) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  if (vcdError || datacentreError) {
    return <Errors error={vcdError?.response || datacentreError?.response} />;
  }

  if (!vcdDatacentre?.data || !vcdOrganization?.data) return <Errors />;

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
