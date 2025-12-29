import { Outlet, useNavigate } from 'react-router-dom';

import GrafanaButton from '@/components/metrics/grafana-button/GrafanaButton.component';
import ServicesDropDown from '@/components/services/ServicesDropDown.component';
import { useTenantsRedirect } from '@/hooks/useTenantsRedirect.hook';
import { urls } from '@/routes/Routes.constants';

const TenantsOutlet = () => {
  // Move the hook here so it stays mounted even when child routes change
  useTenantsRedirect();
  const navigate = useNavigate();

  return (
    <>
      <div className="mb-6 flex items-center justify-end">
        <ServicesDropDown onChange={() => navigate(urls.tenants)} />
        <div className="whitespace-nowrap">
          <GrafanaButton />
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default TenantsOutlet;
