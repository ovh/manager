import { GeneralInformationTile } from '@/components/CommonTiles/GeneralInformationsTile/GeneralInformationTile.component';
import { useBackupTenantDetails } from '@/data/hooks/tenants/useBackupTenantDetails';

type GeneralInformationTenantTileProps = {
  tenantId: string;
};

export function GeneralInformationTenantTile({ tenantId }: GeneralInformationTenantTileProps) {
  const { data, isLoading, isLoadingBackupServicesId } = useBackupTenantDetails({ tenantId });

  return (
    <GeneralInformationTile
      resourceDetails={data}
      isLoading={isLoading || isLoadingBackupServicesId}
    />
  );
}

export default GeneralInformationTenantTile;
