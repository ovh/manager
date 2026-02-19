import {
  TAclAccessLevelDto,
  TAclDto,
  TAclStatusDto,
  TAclToCreateDto,
} from '@/adapters/acl/right/dto.type';
import { TAcl, TAclPermission, TAclStatus, TAclToCreate } from '@/domain/entities/acl.entity';

const aclDtoStatusToStatusMap: Record<string, TAclStatus> = {
  active: 'active',
  applying: 'activating',
  queued_to_apply: 'activating',
  denying: 'deleting',
  queued_to_deny: 'deleting',
  error: 'error',
};

const mapAclDtoStatusToStatus = (status: TAclStatusDto): TAclStatus => {
  const mappedStatus = aclDtoStatusToStatusMap[status];
  if (mappedStatus) return mappedStatus;
  return status;
};

export const mapPermissionsToAccessLevel = (permissions: TAclPermission[]): TAclAccessLevelDto =>
  permissions.includes('write') ? 'rw' : 'ro';

export const mapAccessLevelToPermissions = (accessLevel: TAclAccessLevelDto): TAclPermission[] => [
  ...(accessLevel === 'ro' ? ['read' as const] : []),
  ...(accessLevel === 'rw' ? ['write' as const] : []),
];

export const mapAclDtoToAcl = (dto: TAclDto): TAcl => ({
  id: dto.id,
  source: { id: dto.accessTo },
  permissions: mapAccessLevelToPermissions(dto.accessLevel),
  status: mapAclDtoStatusToStatus(dto.status),
});

export const mapAclToCreateToDto = (aclToCreate: TAclToCreate): TAclToCreateDto => ({
  accessTo: aclToCreate.source.id,
  accessLevel: mapPermissionsToAccessLevel(aclToCreate.permissions),
});
