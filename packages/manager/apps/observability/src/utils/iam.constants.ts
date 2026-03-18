export const IAM_ACTIONS = {
  CREATE_TENANT: ['ldp:apiovh:output/metric/tenant/create'],
  EDIT_TENANT: ['ldp:apiovh:output/metric/tenant/edit'],
  EDIT_SERVICE: ['ldp:apiovh:edit'],
  DELETE_SUBSCRIPTION: ['ldp:apiovh:output/metric/tenant/subscription/delete'],
  CREATE_GRAFANA: ['ldp:apiovh:grafana/create'],
  EDIT_GRAFANA: ['ldp:apiovh:grafana/edit'],
} as const satisfies Record<string, string[]>;

export const RESOURCE_TYPES = {
  TENANT: 'ldp/tenant',
  GRAFANA: 'ldp/grafana',
} as const satisfies Record<string, string>;
