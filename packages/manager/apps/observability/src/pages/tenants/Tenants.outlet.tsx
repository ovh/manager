import { Outlet, useNavigate } from 'react-router-dom';

import ServicesDropDown from '@/components/services/ServicesDropDown.component';
import { useTenantsRedirect } from '@/hooks/useTenantsRedirect.hook';
import { urls } from '@/routes/Routes.constants';

const TenantsOutlet = () => {
  // Move the hook here so it stays mounted even when child routes change
  useTenantsRedirect();
  const navigate = useNavigate();

  return (
    <>
      <ServicesDropDown onChange={() => navigate(urls.tenants)} />
      <Outlet />
    </>
  );
};

export default TenantsOutlet;
