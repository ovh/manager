import React from 'react';
import { Outlet, useNavigate, useOutletContext } from 'react-router-dom';
import { BillingInformationsTileStandard } from '@ovh-ux/billing-informations';
import { DashboardGridLayout } from '@ovh-ux/manager-react-components';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { KMS_ROUTES_URIS } from '@/routes/routes.constants';
import InformationsTile from '@/components/layout-helpers/Dashboard/GeneralInformationsTiles/InformationsTile';
import KmipTile from '@/components/layout-helpers/Dashboard/GeneralInformationsTiles/KmipTile';
import RestApiTile from '@/components/layout-helpers/Dashboard/GeneralInformationsTiles/RestApiTile';
import { KmsDashboardOutletContext } from '@/pages/dashboard/KmsDashboard.type';

function GeneralInformationsTab() {
  const { trackClick } = useOvhTracking();
  const contextValue = useOutletContext<KmsDashboardOutletContext>();
  const { okmsService, okms, okmsDisplayName } = contextValue;

  const navigate = useNavigate();

  const handleResiliateLinkClick = () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.link,
      actionType: 'navigation',
      actions: ['delete_kms'],
    });
    navigate(KMS_ROUTES_URIS.kmsTerminate);
  };

  return (
    <DashboardGridLayout>
      <InformationsTile okmsData={okms} okmsDisplayName={okmsDisplayName} />
      <div className="flex flex-col gap-4 md:gap-6">
        <KmipTile okmsData={okms} />
        <RestApiTile okmsData={okms} />
      </div>
      {okmsService && (
        <BillingInformationsTileStandard
          resourceName={okms.id}
          onResiliateLinkClick={handleResiliateLinkClick}
        />
      )}
      <Outlet context={contextValue} />
    </DashboardGridLayout>
  );
}

export default GeneralInformationsTab;
