import { ResourceStatus } from '@ovh-ux/manager-module-vcd-api';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';

type BadgeStatus = ResourceStatus | 'none' | 'error';
export type BackupBadgeParams = {
  color: ODS_THEME_COLOR_INTENT;
  translationKey: string;
  testIdLabel: string;
};

const getBadgeColor = (status: BadgeStatus) => {
  const colors: Record<BadgeStatus, ODS_THEME_COLOR_INTENT> = {
    error: ODS_THEME_COLOR_INTENT.error,
    none: ODS_THEME_COLOR_INTENT.default,
    DISABLED: ODS_THEME_COLOR_INTENT.default,
    REMOVED: ODS_THEME_COLOR_INTENT.default,
    CREATING: ODS_THEME_COLOR_INTENT.primary,
    DISABLING: ODS_THEME_COLOR_INTENT.primary,
    UPDATING: ODS_THEME_COLOR_INTENT.primary,
    READY: ODS_THEME_COLOR_INTENT.success,
  };
  return colors[status] || ODS_THEME_COLOR_INTENT.default;
};

const getBadgeTranslationKey = (status: BadgeStatus) => {
  const prefix = 'managed_vcd_dashboard_backup_status_';
  const translationKeys: Record<BadgeStatus, string> = {
    error: 'error',
    none: 'unsubscribed',
    DISABLED: 'unsubscribed',
    REMOVED: 'unsubscribed',
    CREATING: 'creating',
    UPDATING: 'updating',
    DISABLING: 'disabling',
    READY: 'subscribed',
  };
  return `${prefix}${translationKeys[status] || 'error'}`;
};

const getBadgeTestId = (status: BadgeStatus) => {
  if (status === 'error') return 'backupError';
  if (status === 'none') return 'noBackup';
  return 'backupStatus';
};

export const getBackupBadgeParams = (
  status: BadgeStatus,
): BackupBadgeParams => {
  return {
    color: getBadgeColor(status),
    translationKey: getBadgeTranslationKey(status),
    testIdLabel: getBadgeTestId(status),
  };
};

export const getBackupBadgeStatus = ({
  errorStatus,
  backupStatus,
}: {
  errorStatus: number;
  backupStatus: ResourceStatus;
}): BadgeStatus => {
  if (backupStatus) return backupStatus;
  return errorStatus === 404 ? 'none' : 'error';
};
