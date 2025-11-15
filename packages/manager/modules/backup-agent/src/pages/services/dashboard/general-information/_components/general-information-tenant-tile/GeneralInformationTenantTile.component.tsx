import { useBackupTenantDetails } from '@/data/hooks/tenants/useBackupTenantDetails';
import { GeneralInformationTile } from '@/components/CommonTiles/GeneralInformationsTile/GeneralInformationTile.component';

type GeneralInformationTenantTileProps = {
  tenantId: string
};

export function GeneralInformationTenantTile({ tenantId }: GeneralInformationTenantTileProps) {
  const { data, isLoading } = useBackupTenantDetails({ tenantId })

  return <GeneralInformationTile resourceDetails={data} isLoading={isLoading} />
}
