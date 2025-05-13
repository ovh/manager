import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  DashboardGridLayout,
  useServiceDetails,
} from '@ovh-ux/manager-react-components';
import { useOkmsById } from '@/data/hooks/useOkms';
import { ROUTES_URLS } from '@/routes/routes.constants';
import InformationsTile from '@/components/layout-helpers/Dashboard/GeneralInformationsTiles/InformationsTile';
import Loading from '@/components/Loading/Loading';
import KmipTile from '@/components/layout-helpers/Dashboard/GeneralInformationsTiles/KmipTile';
import RestApiTile from '@/components/layout-helpers/Dashboard/GeneralInformationsTiles/RestApiTile';
import BillingInformationsTile from '@/components/layout-helpers/Dashboard/GeneralInformationsTiles/BillingInformationsTile';

function GeneralInformationsTab() {
  const { okmsId } = useParams();
  const { data: okms, error, isLoading: isOkmsLoading } = useOkmsById(okmsId);
  const {
    data: okmsService,
    isLoading: isOkmsServiceLoading,
  } = useServiceDetails({ resourceName: okms?.data.id });

  const navigate = useNavigate();

  if (error) {
    navigate(ROUTES_URLS.root);
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
      <div className="flex flex-col gap-6">
        <KmipTile okmsData={okms.data} />
        <RestApiTile okmsData={okms.data} />
      </div>
      <BillingInformationsTile okmsService={okmsService.data} />
    </DashboardGridLayout>
  );
}

export default GeneralInformationsTab;
