const IAM_ACTIONS_PREFIX = 'zimbra:apiovh:platform/';

export const IAM_ACTIONS = {
  account: {
    create: `${IAM_ACTIONS_PREFIX}account/create`,
    delete: `${IAM_ACTIONS_PREFIX}account/delete`,
    edit: `${IAM_ACTIONS_PREFIX}account/edit`,
    get: `${IAM_ACTIONS_PREFIX}account/get`,
  },
  slot: {
    get: `${IAM_ACTIONS_PREFIX}slot/get`,
  },
  alias: {
    create: `${IAM_ACTIONS_PREFIX}alias/create`,
    delete: `${IAM_ACTIONS_PREFIX}alias/delete`,
    get: `${IAM_ACTIONS_PREFIX}alias/get`,
  },
  autoReply: {
    create: `${IAM_ACTIONS_PREFIX}autoReply/create`,
    delete: `${IAM_ACTIONS_PREFIX}autoReply/delete`,
    edit: `${IAM_ACTIONS_PREFIX}autoReply/edit`,
    get: `${IAM_ACTIONS_PREFIX}autoReply/get`,
  },
  domain: {
    create: `${IAM_ACTIONS_PREFIX}domain/create`,
    delete: `${IAM_ACTIONS_PREFIX}domain/delete`,
    edit: `${IAM_ACTIONS_PREFIX}domain/edit`,
    get: `${IAM_ACTIONS_PREFIX}domain/get`,
    diagnose: `${IAM_ACTIONS_PREFIX}diagnostic/domain/get`,
  },
  zoneDNS: {
    get: 'dnsZone:apiovh:get',
  },
  mailingList: {
    create: `${IAM_ACTIONS_PREFIX}mailingList/create`,
    delete: `${IAM_ACTIONS_PREFIX}mailingList/delete`,
    edit: `${IAM_ACTIONS_PREFIX}mailingList/edit`,
    get: `${IAM_ACTIONS_PREFIX}mailingList/get`,
  },
  organization: {
    create: `${IAM_ACTIONS_PREFIX}organization/create`,
    delete: `${IAM_ACTIONS_PREFIX}organization/delete`,
    edit: `${IAM_ACTIONS_PREFIX}organization/edit`,
    get: `${IAM_ACTIONS_PREFIX}organization/get`,
  },
  redirection: {
    create: `${IAM_ACTIONS_PREFIX}redirection/create`,
    delete: `${IAM_ACTIONS_PREFIX}redirection/delete`,
    edit: `${IAM_ACTIONS_PREFIX}redirection/edit`,
    get: `${IAM_ACTIONS_PREFIX}redirection/get`,
  },
  platform: {
    get: `${IAM_ACTIONS_PREFIX}get`,
  },
  task: {
    get: `${IAM_ACTIONS_PREFIX}task/get`,
  },
};

export default { IAM_ACTIONS };
