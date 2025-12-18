export const IAM_ACTIONS = {
  CREATE_TENANT: ['ldp:apiovh:output/metric/tenant/create'],
  EDIT_TENANT: ['ldp:apiovh:output/metric/tenant/edit'],
} as const satisfies Record<string, string[]>;

export const RESOURCE_TYPES = {
  TENANT: 'ldp/tenant',
} as const satisfies Record<string, string>;
