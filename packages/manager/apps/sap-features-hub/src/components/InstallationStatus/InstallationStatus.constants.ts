import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';
import { SAPInstallationStatus } from '@/types/installation.type';

export const BADGE_COLOR_STATUS: Record<string, ODS_BADGE_COLOR> = {
  [SAPInstallationStatus.failure]: ODS_BADGE_COLOR.critical,
  [SAPInstallationStatus.success]: ODS_BADGE_COLOR.success,
  [SAPInstallationStatus.retry]: ODS_BADGE_COLOR.warning,
  [SAPInstallationStatus.pending]: ODS_BADGE_COLOR.information,
  [SAPInstallationStatus.started]: ODS_BADGE_COLOR.information,
} as const;
