import React from 'react';

import { Outlet } from 'react-router-dom';

import { useVcdDatacentre, useVcdOrganization } from '@ovh-ux/manager-module-vcd-api';

import Loading from '@/components/loading/Loading.component';
import { DisplayStatus } from '@/components/status/DisplayStatus';
import DatacentreGenerationInformationTile from '@/components/tiles/datacentre-general-information-tile/DatacentreGeneralInformationTile.component';
import DatacentrePublicIpBlocksTile from '@/components/tiles/datacentre-public-ip-blocks/DatacentrePublicIpBlocksTile.component';
import { useDatacentreParams } from '@/hooks/params/useSafeParams';

export default function DatacentresGeneralInformationPage() {
  const { id, vdcId } = useDatacentreParams();
  const {
    data: vcdOrganization,
    isPending: isLoadingVcd,
    error: vcdError,
  } = useVcdOrganization({
    id,
  });
  const {
    data: vcdDatacentre,
    isPending: isLoadingDatacentre,
    error: datacentreError,
  } = useVcdDatacentre(id, vdcId);

  const queryError = vcdError || datacentreError;

  if (isLoadingVcd || isLoadingDatacentre) return <DisplayStatus variant="loading" />;
  if (queryError) return <DisplayStatus variant="error" error={queryError} />;

  return (
    <React.Suspense fallback={<Loading />}>
      <div className="grid gap-8 px-10 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        <DatacentreGenerationInformationTile
          vcdDatacentre={vcdDatacentre.data}
          vcdOrganization={vcdOrganization.data}
        />
        {!!vcdDatacentre?.data?.currentState?.vrack && (
          <DatacentrePublicIpBlocksTile id={id} vdcId={vdcId} />
        )}
      </div>
      <Outlet />
    </React.Suspense>
  );
}
