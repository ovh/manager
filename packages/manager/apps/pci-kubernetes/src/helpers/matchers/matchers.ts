export const NODE_POOL_NAME_CONSTRAINTS = {
  MAX_LENGTH: 51,
  PATTERN: /^(?:[a-z0-9]|[a-z0-9][a-z0-9-]{0,49}[a-z0-9])$/,
};

export const CLUSTER_NAME_CONSTRAINTS = {
  MAX_LENGTH: 64,
  PATTERN: /^[a-zA-Z]{1}(([a-zA-Z0-9]|_|-){0,62})[a-zA-Z0-9]{1}$/,
};

export const isNodePoolNameValid = (input: string) =>
  NODE_POOL_NAME_CONSTRAINTS.PATTERN.test(input);

export const isClusterNameValid = (input: string) => CLUSTER_NAME_CONSTRAINTS.PATTERN.test(input);
