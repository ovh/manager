import { Outlet } from 'react-router-dom';

import ServicesDropDown from '@/components/services/ServicesDropDown.component';
import { useTenantsRedirect } from '@/hooks/useTenantsRedirect.hook';

const TenantsOutlet = () => {
  // Move the hook here so it stays mounted even when child routes change
  useTenantsRedirect();

  return (
    <>
      <ServicesDropDown />
      <Outlet />
    </>
  );
};

export default TenantsOutlet;
