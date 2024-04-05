import React from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { OsdsSpinner } from '@ovhcloud/ods-components/react';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { useVrackService } from '@/utils/vs-utils';
import { urls } from '@/router/constants';

export default function EndpointsPage() {
  const { data: vrackServices, isLoading } = useVrackService();
  const { id } = useParams();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isLoading) {
      const url =
        vrackServices?.currentState.subnets.some(
          (subnet) => subnet.serviceEndpoints.length > 0,
        ) ||
        vrackServices?.targetSpec.subnets.some(
          (subnet) => subnet.serviceEndpoints.length > 0,
        )
          ? urls.endpointsListing
          : urls.endpointsOnboarding;
      navigate(url.replace(':id', id));
    }
  }, [isLoading]);

  return isLoading ? (
    <div className="mt-5">
      <OsdsSpinner inline size={ODS_SPINNER_SIZE.lg} />
    </div>
  ) : (
    <Outlet />
  );
}
