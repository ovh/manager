import {ResourceStatus} from "@/types/Resource.type";
import {ODS_BADGE_COLOR} from "@ovhcloud/ods-components";
import {vaultStatusColor} from "@/components/ResourceStatusBadge/_utils/resourceStatusColor.utils";

export const getColorResourceStatus = (status: ResourceStatus) =>
  vaultStatusColor[status] ?? ODS_BADGE_COLOR.information;
