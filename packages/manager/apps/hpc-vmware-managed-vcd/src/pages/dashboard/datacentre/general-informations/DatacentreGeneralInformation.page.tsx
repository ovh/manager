import React from 'react';
import { Outlet, useParams } from 'react-router-dom';
import DatacentreGenerationInformationTile from '@/components/tiles/datacentre-general-information-tile/DatacentreGeneralInformationTile.component';
import useManagedVcdOrganization from '@/data/hooks/useManagedVcdOrganization';
import { useManagedVcdDatacentre } from '@/data/hooks/useManagedVcdDatacentres';
import Loading from '@/components/loading/Loading.component';

export default function DatacentresGeneralInformationPage() {
  const { id, vdcId } = useParams();
  const { data: vcdOrganization, isLoading } = useManagedVcdOrganization({
    id,
  });
  const {
    data: vcdDatacentre,
    isLoading: isLoadingVdc,
  } = useManagedVcdDatacentre(id, vdcId);

  if (isLoading || isLoadingVdc) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-10">
      <DatacentreGenerationInformationTile
        vcdDatacentre={vcdDatacentre?.data}
        vcdOrganization={vcdOrganization?.data}
      />
      <Outlet />
    </div>
  );
}
