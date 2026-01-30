/**
 * Maps API/Openstack share status to Manager display (label key + ODS badge color).
 * Spec: green → success, yellow → warning, red → critical.
 * Manager status: Pending (warning), Active (success), Error (critical), NA (neutral).
 */

export type TShareStatusBadgeColor = 'success' | 'warning' | 'critical' | 'neutral';

export type TShareStatusDisplay = {
  labelKey: string;
  badgeColor: TShareStatusBadgeColor;
};

const STATUS_TO_DISPLAY: Record<string, TShareStatusDisplay> = {
  available: { labelKey: 'list:status.active', badgeColor: 'success' },
  creating: { labelKey: 'list:status.pending', badgeColor: 'warning' },
  updating: { labelKey: 'list:status.pending', badgeColor: 'warning' },
  error: { labelKey: 'list:status.error', badgeColor: 'critical' },
  deleting: { labelKey: 'list:status.pending', badgeColor: 'warning' },
  deleted: { labelKey: 'list:status.na', badgeColor: 'neutral' },
  backup_creating: { labelKey: 'list:status.pending', badgeColor: 'warning' },
  error_deleting: { labelKey: 'list:status.error', badgeColor: 'critical' },
  backup_restoring: { labelKey: 'list:status.pending', badgeColor: 'warning' },
  backup_restoring_error: { labelKey: 'list:status.error', badgeColor: 'critical' },
  creating_from_snapshot: { labelKey: 'list:status.pending', badgeColor: 'warning' },
  extending: { labelKey: 'list:status.pending', badgeColor: 'warning' },
  extending_error: { labelKey: 'list:status.error', badgeColor: 'critical' },
  reverting: { labelKey: 'list:status.pending', badgeColor: 'warning' },
  reverting_error: { labelKey: 'list:status.error', badgeColor: 'critical' },
  shrinking: { labelKey: 'list:status.pending', badgeColor: 'warning' },
  shrinking_error: { labelKey: 'list:status.error', badgeColor: 'critical' },
  shrinking_possible_data_loss_error: {
    labelKey: 'list:status.error',
    badgeColor: 'critical',
  },
  awaiting_transfer: { labelKey: 'list:status.pending', badgeColor: 'warning' },
  manage_starting: { labelKey: 'list:status.pending', badgeColor: 'warning' },
  manage_error: { labelKey: 'list:status.error', badgeColor: 'critical' },
  unmanage_starting: { labelKey: 'list:status.pending', badgeColor: 'warning' },
  unmanage_error: { labelKey: 'list:status.error', badgeColor: 'critical' },
  migrating: { labelKey: 'list:status.pending', badgeColor: 'warning' },
  migrating_to: { labelKey: 'list:status.pending', badgeColor: 'warning' },
  replication_change: { labelKey: 'list:status.pending', badgeColor: 'warning' },
};

export const getShareStatusDisplay = (status: string): TShareStatusDisplay =>
  STATUS_TO_DISPLAY[status] ?? {
    labelKey: status,
    badgeColor: 'neutral',
  };
