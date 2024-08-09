import React from 'react';

import { useNavigate, useParams } from 'react-router-dom';
import { useOKMSById } from '@/data/hooks/useOKMS';
import { ROUTES_URLS } from '@/routes/routes.constants';
import InformationsTile from '@/components/layout-helpers/Dashboard/GeneralInformationsTiles/InformationsTile';
import BillingInformationsTile from '@/components/layout-helpers/Dashboard/GeneralInformationsTiles/BillingInformationsTile';
import { useKMSServiceInfos } from '@/data/hooks/useKMSServiceInfos';
import Loading from '@/components/Loading/Loading';

function GeneralInformationsTab() {
  const { okmsId } = useParams();
  const { data: okms, error, isLoading: isOkmsLoading } = useOKMSById(okmsId);
  const {
    data: okmsService,
    isLoading: isOkmsServiceLoading,
  } = useKMSServiceInfos(okms?.data);

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      <InformationsTile okmsData={okms.data} />
      <BillingInformationsTile
        okmsData={okms.data}
        okmsService={okmsService.data}
      />
    </div>
  );
}

export default GeneralInformationsTab;
