export type TShareId = string;

export type TShareStatus =
  | 'available'
  | 'awaiting_transfer'
  | 'backup_creating'
  | 'backup_restoring'
  | 'backup_restoring_error'
  | 'creating'
  | 'creating_from_snapshot'
  | 'deleted'
  | 'deleting'
  | 'error'
  | 'error_deleting'
  | 'extending'
  | 'extending_error'
  | 'inactive'
  | 'manage_error'
  | 'manage_starting'
  | 'migrating'
  | 'migrating_to'
  | 'replication_change'
  | 'reverting'
  | 'reverting_error'
  | 'shrinking'
  | 'shrinking_error'
  | 'shrinking_possible_data_loss_error'
  | 'unmanage_error'
  | 'unmanage_starting'
  | 'unmanaged';

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
};
