export type TShareId = string;

const SHARE_STATUSES = [
  'available',
  'awaiting_transfer',
  'backup_creating',
  'backup_restoring',
  'backup_restoring_error',
  'creating',
  'creating_from_snapshot',
  'deleted',
  'deleting',
  'error',
  'error_deleting',
  'extending',
  'extending_error',
  'inactive',
  'manage_error',
  'manage_starting',
  'migrating',
  'migrating_to',
  'replication_change',
  'reverting',
  'reverting_error',
  'shrinking',
  'shrinking_error',
  'shrinking_possible_data_loss_error',
  'unmanage_error',
  'unmanage_starting',
  'unmanaged',
] as const;

export type TShareStatus = (typeof SHARE_STATUSES)[number];

export const isValidShareStatus = (s: string): s is TShareStatus =>
  (SHARE_STATUSES as readonly string[]).includes(s);

export type TShareEnabledAction =
  | 'acl_management'
  | 'delete'
  | 'edit'
  | 'revert_from_snapshot'
  | 'snapshot_management'
  | 'update_size';

export type TShare = {
  id: TShareId;
  name: string;
  region: string;
  protocol: string;
  size: number;
  status: TShareStatus;
  type: string;
  createdAt: string;
  description: string;
  isPublic: boolean;
  enabledActions: readonly TShareEnabledAction[];
};
