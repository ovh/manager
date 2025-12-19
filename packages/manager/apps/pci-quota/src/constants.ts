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

export const SUPPORT_INCREASE_QUOTA = {
  DEFAULT:
    'https://help.ovhcloud.com/csm/en-public-cloud-compute-increase-quota?id=kb_article_view&sysparm_article=KB0050845',
  ASIA:
    'https://help.ovhcloud.com/csm/asia-public-cloud-compute-increase-quota?id=kb_article_view&sysparm_article=KB0050836',
  AU:
    'https://help.ovhcloud.com/csm/en-au-public-cloud-compute-increase-quota?id=kb_article_view&sysparm_article=KB0050838',
  CA:
    'https://help.ovhcloud.com/csm/en-ca-public-cloud-compute-increase-quota?id=kb_article_view&sysparm_article=KB0050852',
  DE:
    'https://help.ovhcloud.com/csm/de-public-cloud-compute-increase-quota?id=kb_article_view&sysparm_article=KB0038553',
  ES:
    'https://help.ovhcloud.com/csm/es-es-public-cloud-compute-increase-quota?id=kb_article_view&sysparm_article=KB0050853',
  FR:
    'https://help.ovhcloud.com/csm/fr-public-cloud-compute-increase-quota?id=kb_article_view&sysparm_article=KB0050857',
  GB:
    'https://help.ovhcloud.com/csm/en-gb-public-cloud-compute-increase-quota?id=kb_article_view&sysparm_article=KB0050843',
  IE:
    'https://help.ovhcloud.com/csm/en-ie-public-cloud-compute-increase-quota?id=kb_article_view&sysparm_article=KB0050840',
  IN:
    'https://help.ovhcloud.com/csm/en-in-public-cloud-compute-increase-quota?id=kb_article_view&sysparm_article=KB0069471',
  IT:
    'https://help.ovhcloud.com/csm/it-public-cloud-compute-increase-quota?id=kb_article_view&sysparm_article=KB0050847',
  MA:
    'https://help.ovhcloud.com/csm/fr-public-cloud-compute-increase-quota?id=kb_article_view&sysparm_article=KB0050857',
  NL:
    'https://help.ovhcloud.com/csm/en-ie-public-cloud-compute-increase-quota?id=kb_article_view&sysparm_article=KB0050840',
  PL:
    'https://help.ovhcloud.com/csm/pl-public-cloud-compute-increase-quota?id=kb_article_view&sysparm_article=KB0050846',
  PT:
    'https://help.ovhcloud.com/csm/pt-public-cloud-compute-increase-quota?id=kb_article_view&sysparm_article=KB0050849',
  QC:
    'https://help.ovhcloud.com/csm/fr-ca-public-cloud-compute-increase-quota?id=kb_article_view&sysparm_article=KB0050856',
  SG:
    'https://help.ovhcloud.com/csm/en-sg-public-cloud-compute-increase-quota?id=kb_article_view&sysparm_article=KB0050844',
  SN:
    'https://help.ovhcloud.com/csm/fr-public-cloud-compute-increase-quota?id=kb_article_view&sysparm_article=KB0050857',
  TN:
    'https://help.ovhcloud.com/csm/fr-public-cloud-compute-increase-quota?id=kb_article_view&sysparm_article=KB0050857',
  WE:
    'https://help.ovhcloud.com/csm/en-public-cloud-compute-increase-quota?id=kb_article_view&sysparm_article=KB0050845',
  WS:
    'https://help.ovhcloud.com/csm/es-public-cloud-compute-increase-quota?id=kb_article_view&sysparm_article=KB0050858',
  US:
    'https://support.us.ovhcloud.com/hc/en-us/articles/22188629448339-Increasing-Public-Cloud-Quotas',
};
