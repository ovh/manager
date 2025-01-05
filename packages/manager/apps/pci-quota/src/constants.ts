export const PRODUCTS = {
  FLOATING_IP: 'Floating IPs',
  GATEWAYS: 'Gateways',
  LB_OCTAVIA: 'LB Octavia',
};

export const QUOTA_THRESHOLD = 80;

export const iamLink = 'https://www.ovh.com/manager/#/dedicated/iam/policy';

export const RESTRICTED_CORES = 1;

export const RESTRICTED_RAM = 2048;

export const RESTRICTED_INSTANCES = 1;

export const ISSUE_TYPE_IDS = [33381, 33382, 43227, 44486, 44800, 44801];

export const RX_PLAN_CODE_PATTERN = /quota-([0-9]+)vms/;

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
