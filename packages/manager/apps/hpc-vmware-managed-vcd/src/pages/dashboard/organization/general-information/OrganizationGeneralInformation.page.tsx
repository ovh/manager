import React from 'react';
import { Outlet, useParams } from 'react-router-dom';
import Errors from '@/components/error/Error.component';
import Loading from '@/components/loading/Loading.component';
import BillingTile from '@/components/tiles/billing-tile/BillingTile.component';
import OrganizationGenerationInformationTile from '@/components/tiles/organization-general-information-tile/OrganizationGeneralInformationTile.component';
import OrganizationOptionsTile from '@/components/tiles/organization-options-tile/OrganizationOptionsTile.component';
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

  if (isError || isRefetchError) {
    return <Errors error={error?.response} />;
  }

  if (isLoading) {
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
      />
      <div className="flex flex-col gap-8">
        <OrganizationOptionsTile
          isLicenseActive={!!vcdOrganization?.data?.currentState?.spla}
        />
        <DataProtectionTile vcdOrganization={vcdOrganization?.data} />
      </div>
      <div>
        <BillingTile id={id} />
      </div>
      <Outlet />
    </div>
  );
}

export default GeneralInformation;
