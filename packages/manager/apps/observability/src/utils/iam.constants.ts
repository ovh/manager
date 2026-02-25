export const IAM_ACTIONS = {
  CREATE_TENANT: ['ldp:apiovh:output/metric/tenant/create'],
  EDIT_TENANT: ['ldp:apiovh:output/metric/tenant/edit'],
  EDIT_SERVICE: ['ldp:apiovh:edit'],
  DELETE_SUBSCRIPTION: ['ldp:apiovh:output/metric/tenant/subscription/delete'],
} as const satisfies Record<string, string[]>;

export const RESOURCE_TYPES = {
  TENANT: 'ldp/tenant',
} as const satisfies Record<string, string>;
