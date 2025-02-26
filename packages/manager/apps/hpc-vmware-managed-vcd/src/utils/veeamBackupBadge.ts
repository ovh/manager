import { ResourceStatus } from '@ovh-ux/manager-module-vcd-api';
import { OdsBadgeColor } from '@ovhcloud/ods-components';
import TEST_IDS from './testIds.constants';

type BadgeStatus = ResourceStatus | 'none' | 'error';
export type BackupBadgeParams = {
  color: OdsBadgeColor;
  translationKey: string;
  testIdLabel: string;
};

const getBadgeColor = (status: BadgeStatus) => {
  const colors: Record<BadgeStatus, OdsBadgeColor> = {
    error: 'critical',
    none: 'neutral',
    DISABLED: 'neutral',
    REMOVED: 'neutral',
    CREATING: 'information',
    DISABLING: 'information',
    UPDATING: 'information',
    READY: 'success',
  };
  return colors[status] || 'neutral';
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
  if (status === 'error') return TEST_IDS.backupBadgeError;
  if (status === 'none') return TEST_IDS.backupBadgeNone;
  return TEST_IDS.backupBadgeStatus;
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
