import { Outlet } from 'react-router-dom';

import { isStatusTerminated, useVcdOrganization } from '@ovh-ux/manager-module-vcd-api';

import { DisplayStatus } from '@/components/status/DisplayStatus';
import OrganizationDataProtectionTile from '@/components/tiles/organization-data-tile/OrganizationDataProtectionTile.component';
import OrganizationGenerationInformationTile from '@/components/tiles/organization-general-information-tile/OrganizationGeneralInformationTile.component';
import OrganizationOptionsTile from '@/components/tiles/organization-options-tile/OrganizationOptionsTile.component';
import OrganizationServiceManagementTile from '@/components/tiles/organization-service-tile/OrganizationServiceManagementTile.component';
import { useOrganisationParams } from '@/hooks/params/useSafeParams';

export default function GeneralInformation() {
  const { id } = useOrganisationParams();
  const {
    data: vcdOrganization,
    error,
    isPending,
  } = useVcdOrganization({
    id,
    refetchInterval: 60 * 1000,
  });

  if (isPending) return <DisplayStatus variant="loading" />;
  if (error) return <DisplayStatus variant="error" error={error} />;

  return (
    <div className="grid gap-8 px-10 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      <OrganizationGenerationInformationTile vcdOrganization={vcdOrganization.data} />
      <div className="flex flex-col gap-8">
        <OrganizationOptionsTile
          isLicenseActive={!!vcdOrganization.data.currentState.spla}
          isDisabled={isStatusTerminated(vcdOrganization.data.resourceStatus)}
        />
        <OrganizationDataProtectionTile vcdOrganization={vcdOrganization.data} />
      </div>
      <OrganizationServiceManagementTile />
      <Outlet />
    </div>
  );
}
