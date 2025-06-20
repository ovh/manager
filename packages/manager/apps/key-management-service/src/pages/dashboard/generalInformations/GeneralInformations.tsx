import React from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';
import { DashboardGridLayout } from '@ovh-ux/manager-react-components';
import InformationsTile from '@/components/layout-helpers/Dashboard/GeneralInformationsTiles/InformationsTile';
import KmipTile from '@/components/layout-helpers/Dashboard/GeneralInformationsTiles/KmipTile';
import RestApiTile from '@/components/layout-helpers/Dashboard/GeneralInformationsTiles/RestApiTile';
import BillingInformationsTile from '@/components/layout-helpers/Dashboard/GeneralInformationsTiles/BillingInformationsTile';
import { KmsDashboardOutletContext } from '@/pages/dashboard/KmsDashboard.type';

function GeneralInformationsTab() {
  const contextValue = useOutletContext<KmsDashboardOutletContext>();
  const { okmsService, okms, okmsDisplayName } = contextValue;

  return (
    <DashboardGridLayout>
      <InformationsTile okmsData={okms} okmsDisplayName={okmsDisplayName} />
      <div className="flex flex-col gap-4 md:gap-6">
        <KmipTile okmsData={okms} />
        <RestApiTile okmsData={okms} />
      </div>
      {okmsService && <BillingInformationsTile okmsService={okmsService} />}
      <Outlet context={contextValue} />
    </DashboardGridLayout>
  );
}

export default GeneralInformationsTab;
