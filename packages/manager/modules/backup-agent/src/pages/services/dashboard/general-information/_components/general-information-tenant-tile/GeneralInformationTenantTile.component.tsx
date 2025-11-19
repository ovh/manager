import { GeneralInformationTile } from '@/components/CommonTiles/GeneralInformationsTile/GeneralInformationTile.component';
import { useBackupTenantDetails } from '@/data/hooks/tenants/useBackupTenantDetails';

type GeneralInformationTenantTileProps = {
  tenantId: string;
};

export function GeneralInformationTenantTile({ tenantId }: GeneralInformationTenantTileProps) {
  const { data, isLoading } = useBackupTenantDetails({ tenantId });

  return <GeneralInformationTile resourceDetails={data} isLoading={isLoading} />;
}
