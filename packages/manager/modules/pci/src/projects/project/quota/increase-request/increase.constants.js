export const ISSUE_CATEGORY = 'assistance';
export const ISSUE_SERVICE_TYPE = 'cloud_project';

const DEUTSCH_ID = 43228;

// This is the list of issue type ids for the quota increase request for each different language
export const ISSUE_TYPE_IDS = [
  33381,
  33382,
  43227,
  44486,
  44800,
  44801,
  44485,
  DEUTSCH_ID,
];

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

export default {
  ISSUE_CATEGORY,
  ISSUE_SERVICE_TYPE,
  ISSUE_TYPE_IDS,
  TRACK,
  SUPPORT_TICKET_ID_URL,
};
