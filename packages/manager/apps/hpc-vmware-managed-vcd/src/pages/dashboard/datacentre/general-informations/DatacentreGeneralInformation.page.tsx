import React from 'react';
import { Outlet, useParams } from 'react-router-dom';
import {
  useVcdDatacentre,
  useVcdOrganization,
} from '@ovh-ux/manager-module-vcd-api';
import DatacentreGenerationInformationTile from '@/components/tiles/datacentre-general-information-tile/DatacentreGeneralInformationTile.component';
import Loading from '@/components/loading/Loading.component';
import Errors from '@/components/error/Error.component';
import DatacentreUsageTile from '@/components/tiles/datacentre-usage-tile/DatacentreUsageTile.component';

export default function DatacentresGeneralInformationPage() {
  const { id, vdcId } = useParams();
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

  if (vcdError || datacentreError) {
    return <Errors error={vcdError?.response || datacentreError?.response} />;
  }

  if (isLoadingVcd || isLoadingDatacentre) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <React.Suspense fallback={<Loading />}>
      <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-10">
        <DatacentreGenerationInformationTile
          vcdDatacentre={vcdDatacentre?.data}
          vcdOrganization={vcdOrganization?.data}
        />
        <DatacentreUsageTile vcdDatacentre={vcdDatacentre?.data} />
      </div>
      <Outlet />
    </React.Suspense>
  );
}
