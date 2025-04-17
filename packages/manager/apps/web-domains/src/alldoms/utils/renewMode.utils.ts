import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';
import { ServiceInfoRenewMode } from '../enum/service.enum';

export const getRenewMode = (renewProps: string) => {
  if (renewProps === ServiceInfoRenewMode.Automatic) {
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
