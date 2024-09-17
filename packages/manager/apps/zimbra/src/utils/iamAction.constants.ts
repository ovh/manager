const IAM_ACTIONS_PREFIX = 'zimbra:apiovh:platform/';

export const IAM_ACTIONS = {
  account: {
    create: `${IAM_ACTIONS_PREFIX}account/create`,
    delete: `${IAM_ACTIONS_PREFIX}account/delete`,
    edit: `${IAM_ACTIONS_PREFIX}account/edit`,
    get: `${IAM_ACTIONS_PREFIX}account/get`,
  },
  alias: {
    create: `${IAM_ACTIONS_PREFIX}alias/create`,
    delete: `${IAM_ACTIONS_PREFIX}alias/delete`,
  },
  domain: {
    create: `${IAM_ACTIONS_PREFIX}domain/create`,
    delete: `${IAM_ACTIONS_PREFIX}domain/delete`,
  },
  mailingList: {
    create: `${IAM_ACTIONS_PREFIX}mailingList/create`,
    delete: `${IAM_ACTIONS_PREFIX}mailingList/delete`,
    edit: `${IAM_ACTIONS_PREFIX}mailingList/edit`,
  },
  organization: {
    create: `${IAM_ACTIONS_PREFIX}organization/create`,
    delete: `${IAM_ACTIONS_PREFIX}organization/delete`,
    edit: `${IAM_ACTIONS_PREFIX}organization/edit`,
  },
  platform: {
    get: `${IAM_ACTIONS_PREFIX}get`,
  },
  task: {
    get: `${IAM_ACTIONS_PREFIX}task/get`,
  },
};

export default { IAM_ACTIONS };
