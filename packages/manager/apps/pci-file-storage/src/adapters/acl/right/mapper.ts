import { TAclPermission, TAclToCreate } from '@/domain/entities/acl.entity';

import { TAclAccessLevelDto, TAclToCreateDto } from './dto.type';

export const mapPermissionsToAccessLevel = (permissions: TAclPermission[]): TAclAccessLevelDto =>
  permissions.includes('write') ? 'rw' : 'ro';

export const mapAccessLevelToPermissions = (accessLevel: TAclAccessLevelDto): TAclPermission[] => [
  ...(accessLevel === 'ro' ? ['read' as const] : []),
  ...(accessLevel === 'rw' ? ['write' as const] : []),
];

export const mapAclToCreateToDto = (aclToCreate: TAclToCreate): TAclToCreateDto => ({
  accessTo: aclToCreate.source.id,
  accessLevel: mapPermissionsToAccessLevel(aclToCreate.permissions),
});
