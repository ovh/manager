import { TShare, TShareEnabledAction, isValidShareStatus } from '@/domain/entities/share.entity';

import { TShareCapabilityDto, TShareDto } from './dto.type';

const CAPABILITY_TO_ACTION: Map<string, TShareEnabledAction> = new Map([
  ['acl_management', 'acl_management'],
  ['share_delete', 'delete'],
  ['share_edit', 'edit'],
  ['share_revert_from_snapshot', 'revert_from_snapshot'],
  ['snapshot_management', 'snapshot_management'],
  ['share_update_size', 'update_size'],
]);

export const capabilitiesToEnabledActions = (
  capabilities: TShareCapabilityDto[],
): readonly TShareEnabledAction[] =>
  capabilities
    .filter((c) => c.enabled)
    .map((c) => CAPABILITY_TO_ACTION.get(c.name))
    .filter((a) => !!a);

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
  enabledActions: capabilitiesToEnabledActions(dto.capabilities),
  mountPaths: (dto.exportLocations ?? []).map((loc) => loc.path),
});
