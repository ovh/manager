import { BACKUP_AGENT_NAMESPACES } from "@/BackupAgent.translations";
import { Resource } from "@/types/Resource.type";
import { Tenant } from "@/types/Tenant.type";
import { WithRegion } from "@/types/Utils.type";
import { useTranslation } from "react-i18next";

type InstalledAgentsProps = {
    tenantDetails?: Resource<WithRegion<Tenant>>;
};

export function ConnectedVaults({ tenantDetails }: Readonly<InstalledAgentsProps>) {
  const { t } = useTranslation([BACKUP_AGENT_NAMESPACES.SERVICE_DASHBOARD]);
  
    return (
        <>{t('number_of_connected_vaults', { connectedVaultCount: tenantDetails?.currentState.vaults.length})}</>
    )
}