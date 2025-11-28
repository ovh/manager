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

const CLUSTER_API_URL_SCHEME =
  /^(?<shortId>[\da-z]+)\.(?<subRegion>[\da-z]+)\.(?<region>[\da-z]+)\.k8s\.ovh\.net$/;

export const getClusterUrlFragments = (url: string) => {
  const match = url.match(CLUSTER_API_URL_SCHEME);

  if (!match) {
    return null;
  }

  return {
    shortId: match.groups?.['shortId'] as string,
    subRegion: match.groups?.['subRegion'] as string,
    region: match.groups?.['region'] as string,
  };
};
