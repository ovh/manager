import { Outlet, useOutletContext } from 'react-router-dom';

import { KmsDashboardOutletContext } from '@key-management-service/pages/dashboard/KmsDashboard.type';

import { OkmsDomainDashboardTiles } from '@/common/components/okms-dashboard/okms-domain-dashboard-tiles/OkmsDomainDashboardTiles.component';

function GeneralInformationsTab() {
  const contextValue = useOutletContext<KmsDashboardOutletContext>();

  return (
    <>
      <OkmsDomainDashboardTiles okms={contextValue.okms} />
      <Outlet context={contextValue} />
    </>
  );
}

export default GeneralInformationsTab;
