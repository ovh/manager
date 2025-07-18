import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BillingInformationsTileStandard } from '@ovh-ux/billing-informations';
import {
  DashboardGridLayout,
  useServiceDetails,
} from '@ovh-ux/manager-react-components';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { useOkmsById } from '@/data/hooks/useOkms';
import { KMS_ROUTES_URIS, KMS_ROUTES_URLS } from '@/routes/routes.constants';
import InformationsTile from '@/components/layout-helpers/Dashboard/GeneralInformationsTiles/InformationsTile';
import Loading from '@/components/Loading/Loading';
import KmipTile from '@/components/layout-helpers/Dashboard/GeneralInformationsTiles/KmipTile';
import RestApiTile from '@/components/layout-helpers/Dashboard/GeneralInformationsTiles/RestApiTile';

function GeneralInformationsTab() {
  const { okmsId } = useParams();
  const { trackClick } = useOvhTracking();
  const { data: okms, error, isLoading: isOkmsLoading } = useOkmsById(okmsId);
  const {
    data: okmsService,
    isLoading: isOkmsServiceLoading,
  } = useServiceDetails({ resourceName: okms?.data.id });

  const navigate = useNavigate();

  if (error) {
    navigate(KMS_ROUTES_URLS.kmsListing);
  }

  if (isOkmsLoading || isOkmsServiceLoading || !okms || !okmsService) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

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
      <InformationsTile
        okmsData={okms.data}
        okmsServiceInfos={okmsService.data}
      />
      <div className="flex flex-col gap-4 md:gap-6">
        <KmipTile okmsData={okms.data} />
        <RestApiTile okmsData={okms.data} />
      </div>
      <BillingInformationsTileStandard
        resourceName={okms.data.id}
        onResiliateLinkClick={handleResiliateLinkClick}
      />
    </DashboardGridLayout>
  );
}

export default GeneralInformationsTab;
