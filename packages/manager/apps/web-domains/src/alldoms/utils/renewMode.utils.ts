import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';
import { ServiceInfoRenewMode } from '../enum/service.enum';

export const getRenewMode = (renewProps: boolean) => {
  if (renewProps) {
    return {
      renewLabel: ServiceInfoRenewMode.Automatic,
      renewBadge: ODS_BADGE_COLOR.success,
    };
  }

  return {
    renewLabel: ServiceInfoRenewMode.Manual,
    renewBadge: ODS_BADGE_COLOR.warning,
  };
};
