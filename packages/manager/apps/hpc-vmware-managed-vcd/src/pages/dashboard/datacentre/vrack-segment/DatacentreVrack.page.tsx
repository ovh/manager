import React from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { useVcdOrganization } from '@ovh-ux/manager-module-vcd-api';
import Loading from '@/components/loading/Loading.component';
import Errors from '@/components/error/Error.component';
import { VrackSegmentDatagrid } from '@/components/vrackSegment/VrackSegmentDatagrid.component';

export default function VrackListingPage() {
  const { id, vdcId } = useParams();

  const { isError, error } = useVcdOrganization({ id });

  if (isError) {
    return <Errors error={error?.response} />;
  }

  return (
    <React.Suspense fallback={<Loading />}>
      <div className="px-10">
        <VrackSegmentDatagrid id={id} vdcId={vdcId} />
      </div>
      <Outlet />
    </React.Suspense>
  );
}
