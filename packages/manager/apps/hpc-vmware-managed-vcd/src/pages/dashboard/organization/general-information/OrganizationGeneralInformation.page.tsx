import React from 'react';
import { Outlet, useParams } from 'react-router-dom';
import Errors from '@/components/error/Error.component';
import Loading from '@/components/loading/Loading.component';
import BillingTile from '@/components/tiles/billing-tile/BillingTile.component';
import OrganizationGenerationInformationTile from '@/components/tiles/organization-general-information-tile/OrganizationGeneralInformationTile.component';
import OrganizationOptionsTile from '@/components/tiles/organization-options-tile/OrganizationOptionsTile.component';
import useManagedVcdDatacentres from '@/data/hooks/useManagedVcdDatacentres';
import useManagedVcdOrganization from '@/data/hooks/useManagedVcdOrganization';
import DataProtectionTile from '@/components/tiles/organization-data-tile/OrganizationDataProtectionTile.component';

function GeneralInformation() {
  const { id } = useParams();
  const {
    data: vcdOrganization,
    isError,
    isRefetchError,
    error,
    isLoading,
  } = useManagedVcdOrganization({
    id,
    refetchOnWindowFocus: true,
    refetchInterval: 60 * 1000,
  });
  const {
    data: vDatacentres,
    isError: isErrorvDc,
    error: errorVdc,
    isLoading: isLoadingvDc,
  } = useManagedVcdDatacentres(id);

  if (isError || isRefetchError || isErrorvDc) {
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
      <div className="flex flex-col gap-8">
        <OrganizationOptionsTile
          isLicenseActive={!!vcdOrganization?.data?.currentState?.spla}
        />
        <DataProtectionTile />
      </div>
      <div>
        <BillingTile id={id} />
      </div>
      <Outlet />
    </div>
  );
}

export default GeneralInformation;
