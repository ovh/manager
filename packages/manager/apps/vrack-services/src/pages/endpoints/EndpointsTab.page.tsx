import React from 'react';

import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';

import { SPINNER_SIZE, Spinner } from '@ovhcloud/ods-react';

import { useVrackService } from '@ovh-ux/manager-network-common';

import { urls } from '@/routes/RoutesAndUrl.constants';

export default function EndpointsTab() {
  const { data: vrackServices, isLoading } = useVrackService();
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    if (!isLoading && id && location.pathname === urls.endpoints.replace(':id', id)) {
      const url =
        vrackServices?.currentState.subnets.some((subnet) => subnet.serviceEndpoints.length > 0) ||
        vrackServices?.targetSpec.subnets.some((subnet) => subnet.serviceEndpoints.length > 0)
          ? urls.endpointsListing
          : urls.endpointsOnboarding;
      navigate(url.replace(':id', id || ''));
    }
  }, [
    isLoading,
    location.pathname,
    id,
    navigate,
    vrackServices?.currentState.subnets,
    vrackServices?.targetSpec.subnets,
  ]);

  return isLoading ? (
    <div className="mt-5">
      <Spinner size={SPINNER_SIZE.lg} />
    </div>
  ) : (
    <Outlet />
  );
}
