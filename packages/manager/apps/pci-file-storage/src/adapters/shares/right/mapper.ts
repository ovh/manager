import { TShare, TShareStatus } from '@/domain/entities/share.entity';

import { TShareDto } from './dto.type';

const isValidShareStatus = (s: string): s is TShareStatus =>
  [
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
  ].includes(s);

export const mapShareDtoToShare = (dto: TShareDto): TShare => ({
  id: dto.id,
  name: dto.name,
  region: dto.region,
  protocol: dto.protocol,
  size: dto.size,
  status: isValidShareStatus(dto.status) ? dto.status : 'unmanaged',
  type: dto.type,
  createdAt: dto.createdAt,
  description: dto.description,
  isPublic: dto.isPublic,
});
