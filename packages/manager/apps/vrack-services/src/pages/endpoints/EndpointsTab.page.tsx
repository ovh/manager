import React from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { OsdsSpinner } from '@ovhcloud/ods-components/react';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { useVrackService } from '@/data';
import { urls } from '@/routes/routes.constants';

export default function EndpointsTab() {
  const { data: vrackServices, isLoading } = useVrackService();
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    if (!isLoading && location.pathname === urls.endpoints.replace(':id', id)) {
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
  }, [isLoading, location.pathname, id]);

  return isLoading ? (
    <div className="mt-5">
      <OsdsSpinner inline size={ODS_SPINNER_SIZE.lg} />
    </div>
  ) : (
    <Outlet />
  );
}
