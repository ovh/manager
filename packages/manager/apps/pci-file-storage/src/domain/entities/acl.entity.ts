export type TAclId = string;
export const ACL_PERMISSIONS = ['read', 'write'] as const;
export const ACL_STATUSES = ['draft', 'activating', 'active', 'deleting', 'error'] as const;
export type TAclPermission = (typeof ACL_PERMISSIONS)[number];

// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
export type TAclStatus = (typeof ACL_STATUSES)[number] | string;

export type TAcl = {
  id: TAclId;
  source: { id: string };
  permissions: TAclPermission[];
  status: TAclStatus;
};

export type TAclToCreate = Omit<TAcl, 'id'>;
