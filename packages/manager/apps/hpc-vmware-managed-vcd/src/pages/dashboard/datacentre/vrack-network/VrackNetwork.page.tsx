import React from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { useVcdOrganization } from '@ovh-ux/manager-module-vcd-api';
import Loading from '@/components/loading/Loading.component';
import Errors from '@/components/error/Error.component';
import VrackNetworkDatagrid from '@/components/vrackNetwork/VrackNetworkDatagrid.component';

export default function VrackNetworkPage() {
  const { id, vcdId } = useParams();

  const { isError, error } = useVcdOrganization({
    id,
  });

  if (isError) {
    return <Errors error={error?.response} />;
  }

  return (
    <React.Suspense fallback={<Loading />}>
      <div className="px-10">
        <VrackNetworkDatagrid id={id} vdcId={vcdId} />
      </div>
      <Outlet />
    </React.Suspense>
  );
}
