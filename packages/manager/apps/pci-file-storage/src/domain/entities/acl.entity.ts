export type TAclId = string;
export const ACL_PERMISSIONS = ['read', 'write'] as const;
export type TAclPermission = (typeof ACL_PERMISSIONS)[number];

export type TAcl = {
  id: TAclId;
  source: { id: string };
  permissions: TAclPermission[];
};

export type TAclToCreate = Pick<TAcl, 'source' | 'permissions'>;
