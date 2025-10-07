import {OdsBadge} from "@ovhcloud/ods-components/react";
import {getColorVaultStatus} from "@/components/VaultStatusBadge/_utils/getVaultStatusColor.utils";
import {ResourceStatus, VaultResource} from "@/types/Vault.type";
import { useTranslation } from "react-i18next";
import { NAMESPACES } from "@ovh-ux/manager-common-translations";

export type VaultStatusBadgeProps = {
  vaultStatus: ResourceStatus;
}

export const VaultStatusBadge = ({vaultStatus}: VaultStatusBadgeProps) => {
  const {t} = useTranslation(NAMESPACES.STATUS);

  return <OdsBadge
    color={getColorVaultStatus(vaultStatus)}
    label={t(vaultStatus.toLowerCase())}
  />
}
