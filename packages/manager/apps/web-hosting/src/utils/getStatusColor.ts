import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';

import { Status } from '@/data/types/product/ssl';
import { DnsStatus, GitStatus, ResourceStatus, ServiceStatus } from '@/data/types/status';

export const getStatusColor = (
  status: GitStatus | ResourceStatus | ServiceStatus | DnsStatus | Status,
) => {
  switch (status) {
    case GitStatus.CREATED:
    case ResourceStatus.READY:
    case ResourceStatus.DONE:
    case ServiceStatus.ACTIVE:
    case DnsStatus.CONFIGURED:
      return ODS_BADGE_COLOR.success;
    case GitStatus.CREATING:
    case GitStatus.DELETING:
    case GitStatus.DEPLOYING:
    case GitStatus.INITIALERROR:
    case DnsStatus.EXTERNAL:
    case Status.WAITING_USER_INPUT:
      return ODS_BADGE_COLOR.warning;
    case GitStatus.DISABLED:
    case GitStatus.ERROR:
    case ResourceStatus.ERROR:
    case ResourceStatus.SUSPENDED:
    case ServiceStatus.NONE:
      return ODS_BADGE_COLOR.critical;
    case DnsStatus.NOT_CONFIGURED:
      return ODS_BADGE_COLOR.neutral;
    default:
      return ODS_BADGE_COLOR.information;
  }
};
