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
export const REGION = 'GRA7';
export const GUIDE_LINKS = {
  CREATING_AND_USING_A_PRIVATE_IMAGE:
    'https://docs.ovh.com/gb/en/private-registry/creating-and-using-a-private-image/',
  USING_PRIVATE_REGISTRY_WITH_KUBERNETES:
    'https://docs.ovh.com/gb/en/private-registry/using-private-registry-with-kubernetes/',
};

export const DELETE_CONFIRMATION_INPUT = /^DELETE$/;

export default {
  PRIVATE_REGISTRY_STATUS_MAP,
  PRIVATE_REGISTRY_STATUS,
  GUIDES,
  GUIDE_LINKS,
  DELETE_CONFIRMATION_INPUT,
  REGION,
};
