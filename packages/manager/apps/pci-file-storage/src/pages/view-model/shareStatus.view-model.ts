import { TShareStatus } from '@/domain/entities/share.entity';

export type TShareStatusBadgeColor = 'success' | 'warning' | 'critical' | 'neutral';

export type TShareStatusDisplay = {
  labelKey: string;
  badgeColor: TShareStatusBadgeColor;
};

const STATUS_TO_DISPLAY = new Map<TShareStatus, TShareStatusDisplay>([
  // with own translation
  ['available', { labelKey: 'status:active', badgeColor: 'success' }],
  ['backup_creating', { labelKey: 'status:backup_creating', badgeColor: 'warning' }],
  ['creating', { labelKey: 'status:creating', badgeColor: 'warning' }],
  ['creating_from_snapshot', { labelKey: 'status:creating', badgeColor: 'warning' }],
  ['deleting', { labelKey: 'status:deleting', badgeColor: 'warning' }],
  ['extending', { labelKey: 'status:extending', badgeColor: 'warning' }],
  ['inactive', { labelKey: 'status:inactive', badgeColor: 'critical' }],
  // mapped to error
  ['backup_restoring_error', { labelKey: 'status:error', badgeColor: 'critical' }],
  ['error', { labelKey: 'status:error', badgeColor: 'critical' }],
  ['error_deleting', { labelKey: 'status:error', badgeColor: 'critical' }],
  ['extending_error', { labelKey: 'status:error', badgeColor: 'critical' }],
  //not translated but with specific color
  ['backup_restoring', { labelKey: 'backup_restoring', badgeColor: 'warning' }],
]);

export const getShareStatusDisplay = (status: string): TShareStatusDisplay =>
  STATUS_TO_DISPLAY.get(status) ?? {
    labelKey: status,
    badgeColor: 'neutral',
  };
