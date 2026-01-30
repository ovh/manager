import React from 'react';

import { Outlet } from 'react-router-dom';

import { useVcdOrganization } from '@ovh-ux/manager-module-vcd-api';

import Errors from '@/components/error/Error.component';
import Loading from '@/components/loading/Loading.component';
import { VrackSegmentDatagrid } from '@/components/vrackSegment/VrackSegmentDatagrid.component';
import { useDatacentreParams } from '@/hooks/params/useSafeParams';

export default function VrackListingPage() {
  const { id, vdcId } = useDatacentreParams();

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
