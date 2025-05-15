export const PRODUCTS = {
  FLOATING_IP: 'Floating IPs',
  GATEWAYS: 'Gateways',
  LB_OCTAVIA: 'LB Octavia',
};

export const QUOTA_THRESHOLD = 80;

export const IAM_LINK = 'https://www.ovh.com/manager/#/dedicated/iam/policy';
export const SUPPORT_LINK =
  'https://us.ovhcloud.com/manager/#/dedicated/ticket';

export const RESTRICTED_CORES = 1;

export const RESTRICTED_RAM = 2048;

export const RESTRICTED_INSTANCES = 1;

const DEUTSCH_ID = 43228;
// This is the list of issue type ids for the quota increase request for each different language
export const SUPPORT_ISSUE_TYPE_IDS = [
  33381,
  33382,
  43227,
  44486,
  44800,
  44801,
  44485,
  DEUTSCH_ID,
];

export const RX_PLAN_CODE_PATTERN = /quota-(\d+)vms/;

export const TRACK = {
  BASE: 'PublicCloud::pci::projects::project::quota',
  SELECT_PLAN: 'select-plan',
  CONTACT_SUPPORT: 'increase-contact',
  BASE_CONTACT_SUPPORT_BANNER: 'PublicCloud::quota-contact-banner',
  BASE_SELECT_PLAN_BANNER: 'PublicCloud::quota-select-plan-banner',
  CANCEL: 'cancel',
  CONFIRM: 'confirm',
  ERROR: 'error',
  SUCCESS: 'success',
};

export const SUPPORT_TICKET_ID_URL =
  'https://help.ovhcloud.com/csm?id=csm_ticket&table=sn_customerservice_case&number=CS{ticketId}&view=csp&ovhSubsidiary=';
