import {ResourceStatus} from "@/types/Vault.type";
import {ODS_BADGE_COLOR} from "@ovhcloud/ods-components";

export const vaultStatusColor: Record<ResourceStatus, ODS_BADGE_COLOR> = {
  CREATING: ODS_BADGE_COLOR.information,
  DELETING: ODS_BADGE_COLOR.critical,
  ERROR: ODS_BADGE_COLOR.critical,
  READY: ODS_BADGE_COLOR.success,
  SUSPENDED: ODS_BADGE_COLOR.warning,
  UPDATING: ODS_BADGE_COLOR.information,
};
