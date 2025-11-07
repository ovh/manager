import { BACKUP_AGENT_NAMESPACES } from "@/BackupAgent.translations";
import { useInstalledBackupAgents } from "@/data/hooks/tenants/useVspcTenants";
import { AssociatedTenantVSPC } from "@/types/Tenant.type";
import { useTranslation } from "react-i18next";

type InstalledAgentsProps = {
    vspcTenants?: AssociatedTenantVSPC[];
};

export function InstalledAgents({ vspcTenants }: Readonly<InstalledAgentsProps>) {
      const { t } = useTranslation([BACKUP_AGENT_NAMESPACES.SERVICE_DASHBOARD]);
    const { installedBackupAgents } = useInstalledBackupAgents({ vspcTenants: vspcTenants! })

    return (
        <>{t('number_of_installed_agents', { installedAgentsCount: installedBackupAgents })}</>
    )
}