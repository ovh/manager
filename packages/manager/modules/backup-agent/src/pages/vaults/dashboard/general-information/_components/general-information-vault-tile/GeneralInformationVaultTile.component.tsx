import { useBackupVaultDetails } from '@/data/hooks/vaults/getVaultDetails';
import { GeneralInformationTile } from '@/components/CommonTiles/GeneralInformationsTile/GeneralInformationTile.component';

type GeneralInformationVaultTileProps = {
  vaultId: string
};

export function GeneralInformationVaultTile({ vaultId }: GeneralInformationVaultTileProps) {
  const { data, isLoading } = useBackupVaultDetails({ vaultId })

  return <GeneralInformationTile resourceDetails={data} isLoading={isLoading} />
}
