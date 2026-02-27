import { BADGE_COLOR } from '@ovhcloud/ods-react';
import { LicenseStatus } from '@/types/hycu.details.interface';

/* v8 ignore start */
export const getStatusColor = (licenseStatus: LicenseStatus): BADGE_COLOR => {
  switch (licenseStatus) {
    case LicenseStatus.ACTIVATED:
      return BADGE_COLOR.success;
    case LicenseStatus.TO_ACTIVATE:
      return BADGE_COLOR.warning;
    case LicenseStatus.PENDING:
      return BADGE_COLOR.primary;
    case LicenseStatus.ERROR:
    default:
      return BADGE_COLOR.critical;
  }
};
