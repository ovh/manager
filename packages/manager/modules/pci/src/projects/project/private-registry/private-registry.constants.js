export const PRIVATE_REGISTRY_STATUS_MAP = {
  ERROR: 'error',
  READY: 'success',
  DELETED: 'error',
  SUSPENDED: 'error',
  INSTALLING: 'info',
  UPDATING: 'warning',
  RESTORING: 'warning',
  SUSPENDING: 'warning',
  DELETING: 'warning',
  SCALING_UP: 'info',
};

export const PRIVATE_REGISTRY_STATUS = {
  ERROR: 'ERROR',
  READY: 'READY',
  DELETED: 'DELETED',
  SUSPENDED: 'SUSPENDED',
  INSTALLING: 'INSTALLING',
  UPDATING: 'UPDATING',
  RESTORING: 'RESTORING',
  SUSPENDING: 'SUSPENDING',
  DELETING: 'DELETING',
  SCALING_UP: 'SCALING_UP',
};

export const GUIDES = [
  {
    id: 'configure',
    link: 'https://docs.ovh.com/',
  },
  {
    id: 'registry',
    link: 'https://docs.ovh.com/',
  },
  {
    id: 'deploy',
    link: 'https://docs.ovh.com/',
  },
];
export const DELETE_CONFIRMATION_INPUT = /^DELETE$/;

export default {
  PRIVATE_REGISTRY_STATUS_MAP,
  PRIVATE_REGISTRY_STATUS,
  GUIDES,
  DELETE_CONFIRMATION_INPUT,
};
