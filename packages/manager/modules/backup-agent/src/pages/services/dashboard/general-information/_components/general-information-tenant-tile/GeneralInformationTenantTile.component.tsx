import { GeneralInformationTile } from '@/components/CommonTiles/GeneralInformationsTile/GeneralInformationTile.component';
import { useBackupVSPCTenantDetails } from '@/data/hooks/tenants/useVspcTenantDetails';

type GeneralInformationTenantTileProps = {
  tenantId: string;
};

export function GeneralInformationTenantTile({ tenantId }: GeneralInformationTenantTileProps) {
  const { data, isLoading, isLoadingBackupServicesId } = useBackupVSPCTenantDetails({ tenantId });

  return (
    <GeneralInformationTile
      resourceDetails={data}
      isLoading={isLoading || isLoadingBackupServicesId}
    />
  );
}

export default GeneralInformationTenantTile;
