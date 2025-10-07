import {ResourceStatus} from "@/types/Vault.type";
import {ODS_BADGE_COLOR} from "@ovhcloud/ods-components";
import {vaultStatusColor} from "@/components/VaultStatusBadge/_utils/vaultStatusColor.utils";

export const getColorVaultStatus = (status: ResourceStatus) =>
  vaultStatusColor[status] ?? ODS_BADGE_COLOR.information;
