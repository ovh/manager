import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  DashboardGridLayout,
  useServiceDetails,
} from '@ovh-ux/manager-react-components';
import { useOkmsById } from '@/data/hooks/useOkms';
import { KMS_ROUTES_URLS } from '@/routes/routes.constants';
import InformationsTile from '@/components/layout-helpers/Dashboard/GeneralInformationsTiles/InformationsTile';
import Loading from '@/components/Loading/Loading';
import KmipTile from '@/components/layout-helpers/Dashboard/GeneralInformationsTiles/KmipTile';
import RestApiTile from '@/components/layout-helpers/Dashboard/GeneralInformationsTiles/RestApiTile';
import BillingInformationsTile from '@/components/layout-helpers/Dashboard/GeneralInformationsTiles/BillingInformationsTile';

function GeneralInformationsTab() {
  const { okmsId } = useParams() as { okmsId: string };
  const { data: okms, error, isLoading: isOkmsLoading } = useOkmsById(okmsId);
  const {
    data: okmsService,
    isLoading: isOkmsServiceLoading,
    // This has been refactored and removed by https://github.com/ovh/manager/pull/17804
    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain, @typescript-eslint/no-non-null-assertion
  } = useServiceDetails({ resourceName: okms?.data.id! });

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
      {okmsService.data && (
        <BillingInformationsTile okmsService={okmsService.data} />
      )}
    </DashboardGridLayout>
  );
}

export default GeneralInformationsTab;
