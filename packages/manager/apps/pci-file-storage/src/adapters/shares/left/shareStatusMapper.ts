import { TShareStatus } from '@/domain/entities/share.entity';

export type TShareStatusBadgeColor = 'success' | 'warning' | 'critical' | 'neutral';

export type TShareStatusDisplay = {
  labelKey: string;
  badgeColor: TShareStatusBadgeColor;
};

const STATUS_TO_DISPLAY = new Map<TShareStatus, TShareStatusDisplay>([
  ['available', { labelKey: 'status:active', badgeColor: 'success' }],
  ['backup_creating', { labelKey: 'status:backup_creating', badgeColor: 'warning' }],
  ['backup_restoring', { labelKey: 'backup_restoring', badgeColor: 'warning' }],
  ['backup_restoring_error', { labelKey: 'status:error', badgeColor: 'critical' }],
  ['creating', { labelKey: 'status:creating', badgeColor: 'warning' }],
  ['creating_from_snapshot', { labelKey: 'creating_from_snapshot', badgeColor: 'warning' }],
  ['deleting', { labelKey: 'status:deleting', badgeColor: 'warning' }],
  ['error', { labelKey: 'status:error', badgeColor: 'critical' }],
  ['error_deleting', { labelKey: 'status:error', badgeColor: 'critical' }],
  ['extending', { labelKey: 'status:extending', badgeColor: 'warning' }],
  ['inactive', { labelKey: 'status:inactive', badgeColor: 'critical' }],
]);

export const getShareStatusDisplay = (status: string): TShareStatusDisplay =>
  STATUS_TO_DISPLAY.get(status as TShareStatus) ?? {
    labelKey: status,
    badgeColor: 'neutral',
  };
