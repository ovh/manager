import { GeneralInformationTile } from '@/components/CommonTiles/GeneralInformationsTile/GeneralInformationTile.component';
import { useBackupVSPCTenantDetails } from '@/data/hooks/tenants/useVspcTenantDetails';

type GeneralInformationTenantTileProps = {
  tenantId: string;
};

export function GeneralInformationTenantTile({ tenantId }: GeneralInformationTenantTileProps) {
  const { data, isLoading } = useBackupVSPCTenantDetails({ tenantId });

  return <GeneralInformationTile resourceDetails={data} isLoading={isLoading} />;
}

export default GeneralInformationTenantTile;
