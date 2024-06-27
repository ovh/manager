import React from 'react';

import { useNavigate, useParams } from 'react-router-dom';
import { useOKMSById } from '@/hooks/useOKMS';
import Loading from '@/components/Loading/Loading';
import { ROUTES_URLS } from '@/routes/routes.constants';
import InformationsTile from '@/components/layout-helpers/Dashboard/GeneralInformationsTiles/InformationsTile';
import BillingInformationsTile from '@/components/layout-helpers/Dashboard/GeneralInformationsTiles/BillingInformationsTile';

function GeneralInformationsTab() {
  const { okmsId } = useParams();
  const { data, error, isLoading } = useOKMSById(okmsId);

  const navigate = useNavigate();

  if (error) {
    navigate(ROUTES_URLS.root);
  }

  if (isLoading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
      <div className="p-3">
        <InformationsTile okmsData={data.data} />
      </div>
      <div className="p-3">
        <BillingInformationsTile okmsData={data.data} />
      </div>
    </div>
  );
}

export default GeneralInformationsTab;
