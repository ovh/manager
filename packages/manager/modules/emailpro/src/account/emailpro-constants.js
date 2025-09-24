export const SIZE_UNIT = 'GB';

export const STATE_TASK_DOING = 'TASK_ON_DOING';
export const STATE_TASK_ERROR = 'TASK_ON_ERROR';
export const ACCOUNT_TYPES = ['ALL', 'BASIC', 'STANDARD', 'ENTERPRISE'];
export const FILTER_TYPE = 'ALL';

export const rootSupportUrl = 'https://help.ovhcloud.com/';

export const OVH_MAIL_MIGRATOR_URL = 'https://omm.ovh.net/';

export const SUPPORT_URL_VIEW_TICKETS = `${rootSupportUrl}csm?id=csm_cases_requests&ovhSubsidiary=`;

export const ZIMBRA_PASSWORD_REGEX = /^(?=.*[!@#$%^&*()\\[\]{}\-_+=~`|:;"'<>,./?])(?=.*\d)(?=.*[A-Z])(?=(.*)).{10,64}$/;

export default {
  SIZE_UNIT,
  STATE_TASK_DOING,
  STATE_TASK_ERROR,
  ACCOUNT_TYPES,
  FILTER_TYPE,
  SUPPORT_URL_VIEW_TICKETS,
  OVH_MAIL_MIGRATOR_URL,
};
