export const NAME_INPUT_CONSTRAINTS = {
  MAX_LENGTH: 64,
  PATTERN: /^[a-zA-Z](([a-zA-Z0-9-]|_|-)*)[a-zA-Z0-9]$/,
};

export const STATUS = {
  READY: 'READY',
  INSTALLING: 'INSTALLING',
  DELETING: 'DELETING',
  UPDATING: 'UPDATING',
  RESETTING: 'RESETTING',
  ERROR: 'ERROR',
  SUSPENDING: 'SUSPENDING',
  REOPENING: 'REOPENING',
  REDEPLOYING: 'REDEPLOYING',
  SUSPENDED: 'SUSPENDED',
  USER_ERROR: 'USER_ERROR',
  USER_QUOTA_ERROR: 'USER_QUOTA_ERROR',
};

export const HORIZON_LINK_TRUSTED = {
  EU:
    'https://horizon.trustedzone.cloud.ovh.net/auth/login?username={username}',
  CA:
    'https://horizon.trustedzone.cloud.ovh.net/auth/login?username={username}',
  US: '',
};

export const ALPHA_CHARACTERS_REGEX = /^[a-zA-Z-]+$/;

export const CONFIG_FILENAME = 'kubeconfig';

export const KUBECONFIG_URL =
  'https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig';
