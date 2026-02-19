import { ACL_PERMISSIONS, type TAclToCreate } from '@/domain/entities/acl.entity';

export const isAclToCreateValid = ({ source, permissions }: TAclToCreate): boolean =>
  !!source.id &&
  permissions.every((permission) => ACL_PERMISSIONS.includes(permission)) &&
  permissions.length <= ACL_PERMISSIONS.length;
