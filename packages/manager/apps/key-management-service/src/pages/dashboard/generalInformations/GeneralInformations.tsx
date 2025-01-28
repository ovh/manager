import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  DashboardGridLayout,
  useServiceDetails,
} from '@ovh-ux/manager-react-components';
import { useOKMSById } from '@/data/hooks/useOKMS';
import { ROUTES_URLS } from '@/routes/routes.constants';
import InformationsTile from '@/components/layout-helpers/Dashboard/GeneralInformationsTiles/InformationsTile';
import BillingInformationsTile from '@/components/layout-helpers/Dashboard/GeneralInformationsTiles/BillingInformationsTile';
import Loading from '@/components/Loading/Loading';

function GeneralInformationsTab() {
  const { okmsId } = useParams();
  const { data: okms, error, isLoading: isOkmsLoading } = useOKMSById(okmsId);
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
      <BillingInformationsTile okmsService={okmsService.data} />
    </DashboardGridLayout>
  );
}

export default GeneralInformationsTab;
