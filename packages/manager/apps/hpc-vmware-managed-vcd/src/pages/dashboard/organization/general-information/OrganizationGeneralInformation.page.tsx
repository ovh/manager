import React from 'react';
import { useParams } from 'react-router-dom';
import Errors from '@/components/error/Error.component';
import Loading from '@/components/loading/Loading.component';
import BillingTile from '@/components/tiles/billing-tile/BillingTile.component';
import OrganizationGenerationInformationTile from '@/components/tiles/organization-general-information-tile/OrganizationGeneralInformationTile.component';
import OrganizationOptionsTile from '@/components/tiles/organization-options-tile/OrganizationOptionsTile.component';
import useManagedVcdDatacentres from '@/data/hooks/useManagedVcdDatacentres';
import useManagedVcdOrganization from '@/data/hooks/useManagedVcdOrganization';

function GeneralInformation() {
  const { id } = useParams();
  const {
    data: vcdOrganization,
    isError,
    error,
    isLoading,
  } = useManagedVcdOrganization(id);
  const {
    data: vDatacentres,
    isError: isErrorvDc,
    error: errorVdc,
    isLoading: isLoadingvDc,
  } = useManagedVcdDatacentres(id);

  if (isError || isErrorvDc) {
    return <Errors error={error?.response ?? errorVdc?.response} />;
  }

  if (isLoading || isLoadingvDc) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-10">
      <OrganizationGenerationInformationTile
        vcdOrganization={vcdOrganization?.data}
        datacenterCount={vDatacentres?.data?.length}
      />
      <div>
        <OrganizationOptionsTile />
      </div>
      <div>
        <BillingTile id={id} />
      </div>
    </div>
  );
}

export default GeneralInformation;
