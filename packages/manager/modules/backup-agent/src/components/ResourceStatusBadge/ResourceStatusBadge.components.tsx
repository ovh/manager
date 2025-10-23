import {OdsBadge} from "@ovhcloud/ods-components/react";
import {getColorResourceStatus} from "./_utils/getResourceStatusColor.utils";
import {ResourceStatus} from "@/types/Resource.type";
import { useTranslation } from "react-i18next";
import { NAMESPACES } from "@ovh-ux/manager-common-translations";

export type ResourceStatusBadgeProps = {
  vaultStatus: ResourceStatus;
}

export const ResourceStatusBadge = ({vaultStatus}: ResourceStatusBadgeProps) => {
  const {t} = useTranslation(NAMESPACES.STATUS);

  return <OdsBadge
    color={getColorResourceStatus(vaultStatus)}
    label={t(vaultStatus.toLowerCase())}
  />
}
