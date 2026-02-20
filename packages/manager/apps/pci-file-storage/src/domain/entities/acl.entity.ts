export type TAclId = string;
export const ACL_PERMISSIONS = ['read', 'write'] as const;
export type TAclPermission = (typeof ACL_PERMISSIONS)[number];

// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
export type TAclStatus = 'draft' | 'activating' | 'active' | 'deleting' | 'error' | string;

export type TAcl = {
  id: TAclId;
  source: { id: string };
  permissions: TAclPermission[];
  status: TAclStatus;
};

export type TAclToCreate = Omit<TAcl, 'id'>;
