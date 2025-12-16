import React from 'react';
import { SPINNER_SIZE, Spinner } from '@ovhcloud/ods-react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useVrackService } from '@ovh-ux/manager-network-common';
import { urls } from '@/routes/routes.constants';

export default function SubnetsTab() {
  const { data: vrackServices, isLoading } = useVrackService();
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    if (!isLoading && location.pathname === urls.subnets.replace(':id', id)) {
      const url =
        vrackServices?.currentState.subnets.length === 0 &&
        vrackServices?.targetSpec.subnets.length === 0
          ? urls.subnetsOnboarding
          : urls.subnetsListing;
      navigate(url.replace(':id', id));
    }
  }, [isLoading, location.pathname, id]);

  return isLoading ? (
    <div className="mt-5">
      <Spinner size={SPINNER_SIZE.lg} />
    </div>
  ) : (
    <React.Suspense>
      <Outlet />
    </React.Suspense>
  );
}
