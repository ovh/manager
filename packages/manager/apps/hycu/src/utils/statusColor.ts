import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { LicenseStatus } from '@/type/hycu.details.interface';

export const getStatusColor = (
  licenseStatus: LicenseStatus,
): ODS_THEME_COLOR_INTENT => {
  switch (licenseStatus) {
    case LicenseStatus.ACTIVATED:
      return ODS_THEME_COLOR_INTENT.success;
    case LicenseStatus.TO_ACTIVATE:
      return ODS_THEME_COLOR_INTENT.warning;
    case LicenseStatus.PENDING:
      return ODS_THEME_COLOR_INTENT.primary;
    case LicenseStatus.ERROR:
    default:
      return ODS_THEME_COLOR_INTENT.error;
  }
};
