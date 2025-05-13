export const DOMAIN_OBJECT_KEYS = {
  RENEWAL_DATE: 'renewalDate',
  EXPIRATION_DATE: 'expirationDate',
  RENEWAL_STATE: 'renewalState',
};

export const DOMAIN_STATUS = {
  OK: 'ok',
  EXPIRED: 'expired',
  RESTORABLE: 'restorable',
  DELETED: 'deleted',
  PENDING_DELETE: 'pending_delete',
  PENDING_OUTGOING_TRANSFER: 'pending_outgoing_transfer',
  DISPUTE: 'dispute',
  PENDING_CREATE: 'pending_create',
  PENDING_INSTALLATION: 'pending_installation',
  PENDING_INCOMING_TRANSFER: 'pending_incoming_transfer',
  TECHNICAL_SUSPENDED: 'technical_suspended',
  REGISTRY_SUSPENDED: 'registry_suspended',
  AUTORENEW_IN_PROGRESS: 'autorenew_in_progress',
  AUTORENEW_REGISTRY_IN_PROGRESS: 'autorenew_registry_in_progress',
};

export const DOMAIN_DNSSEC_STATE = {
  ENABLED: 'enabled',
  DISABLED: 'disabled',
  NOT_SUPPORTED: 'not_supported',
};

export const DOMAIN_RENEWABLE_STATE = {
  MANUAL_RENEW: 'manual_renew',
  AUTOMATIC_RENEW: 'automatic_renew',
  CANCELLATION_REQUESTED: 'cancellation_requested',
  CANCELLATION_COMPLETE: 'cancellation_complete',
  UNPAID: 'unpaid',
  EXPIRED: 'expired',
};

export const DOMAIN_RENEWAL_MODE = {
  AUTOMATIC_RENEW: 'automatic_renew',
  MANUAL_RENEW: 'manual_renew',
  CANCELLATION_REQUESTED: 'cancellation_requested',
  CANCELLATION_COMPLETE: 'cancellation_complete',
  UNPAID: 'unpaid',
  EXPIRED: 'expired',
};

export const DOMAIN_SUSPENSION_STATE = {
  NOT_SUSPENDED: 'not_suspended',
  SUSPENDED: 'suspended',
};

export const DOMAIN_TRANSFER_LOCK_STATE = {
  LOCKED: 'locked',
  LOCKING: 'locking',
  UNAVAILABLE: 'unavailable',
  UNLOCKED: 'unlocked',
  UNLOCKING: 'unlocking',
};

export const DOMAIN_NAME_SERVER_TYPE = {
  HOSTED_BY: 'hosted by',
  EXTERNAL: 'external',
};

export const DOMAINS_BADGES_RENEWAL_MODE = {
  [DOMAIN_RENEWAL_MODE.AUTOMATIC_RENEW]: 'oui-badge_success',
  [DOMAIN_RENEWAL_MODE.MANUAL_RENEW]: 'oui-badge_warning',
  [DOMAIN_RENEWAL_MODE.CANCELLATION_REQUESTED]: 'oui-badge_error',
  [DOMAIN_RENEWAL_MODE.CANCELLATION_COMPLETE]: 'oui-badge_error',
  [DOMAIN_RENEWAL_MODE.UNPAID]: 'oui-badge_error',
  [DOMAIN_RENEWAL_MODE.EXPIRED]: 'oui-badge_error',
};

export const DOMAINS_BADGES_STATUS = {
  [DOMAIN_STATUS.OK]: 'oui-badge_success',
  [DOMAIN_STATUS.EXPIRED]: 'oui-badge_warning',
  [DOMAIN_STATUS.RESTORABLE]: 'oui-badge_warning',
  [DOMAIN_STATUS.DELETED]: 'oui-badge_error',
  [DOMAIN_STATUS.PENDING_DELETE]: 'oui-badge_error',
  [DOMAIN_STATUS.PENDING_OUTGOING_TRANSFER]: 'oui-badge_warning',
  [DOMAIN_STATUS.DISPUTE]: 'oui-badge_limited-edition',
  [DOMAIN_STATUS.PENDING_INSTALLATION]: 'oui-badge_info',
  [DOMAIN_STATUS.PENDING_CREATE]: 'oui-badge_info',
  [DOMAIN_STATUS.PENDING_INCOMING_TRANSFER]: 'oui-badge_info',
  [DOMAIN_STATUS.TECHNICAL_SUSPENDED]: 'oui-badge_limited-edition',
  [DOMAIN_STATUS.REGISTRY_SUSPENDED]: 'oui-badge_limited-edition',
  [DOMAIN_STATUS.AUTORENEW_IN_PROGRESS]: 'oui-badge_info',
  [DOMAIN_STATUS.AUTORENEW_REGISTRY_IN_PROGRESS]: 'oui-badge_info',
};

export const DOMAIN_SUSPENSION_STATE_CLASS = {
  [DOMAIN_SUSPENSION_STATE.NOT_SUSPENDED]: 'oui-color-product-beta',
  [DOMAIN_SUSPENSION_STATE.SUSPENDED]: 'oui-color-g-400',
};

export const DOMAIN_TRANSFER_LOCK_STATE_CLASS = {
  [DOMAIN_TRANSFER_LOCK_STATE.LOCKED]:
    'oui-icon-padlock-closed_concept oui-color-product-beta',
  [DOMAIN_TRANSFER_LOCK_STATE.UNLOCKED]:
    'oui-icon-padlock-opened_concept oui-color-g-400',
};

export const DOMAIN_DNSSEC_STATE_CLASS = {
  [DOMAIN_DNSSEC_STATE.ENABLED]: 'oui-color-product-beta',
  [DOMAIN_DNSSEC_STATE.DISABLED]: 'oui-color-g-400',
  [DOMAIN_DNSSEC_STATE.NOT_SUPPORTED]: 'oui-color-g-100',
};

export const DOMAIN_COLUMN_DNSSEC = 'DNSSEC';

export const IDN_PREFIX = 'xn--';
export const LANGUAGE_OVERRIDE = { IN: `en-IN` };

export const MONTH_DATE_FORMAT = {
  month: '2-digit',
  year: 'numeric',
};

export const DATE_FORMAT = {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
};

export const PRODUCT_TYPE = 'DOMAIN';

const PREFIX_GUIDES_URL = 'https://help.ovhcloud.com/csm/';
const SUFFIX_URL_GENERAL_INFORMATION =
  '?id=kb_browse_cat&kb_id=e17b4f25551974502d4c6e78b7421955&kb_category=54441955f49801102d4ca4d466a7fdb2';
export const DOMAINS_GUIDES = [
  {
    translateKey: 'domains_guides_general_information',
    url: {
      DEFAULT: `${PREFIX_GUIDES_URL}world-documentation-web-cloud-domains${SUFFIX_URL_GENERAL_INFORMATION}`,
      ASIA: `${PREFIX_GUIDES_URL}asia-documentation-web-cloud-domains${SUFFIX_URL_GENERAL_INFORMATION}`,
      DE: `${PREFIX_GUIDES_URL}de-documentation-web-cloud-domains${SUFFIX_URL_GENERAL_INFORMATION}`,
      ES: `${PREFIX_GUIDES_URL}es-es-documentation-web-cloud-domains${SUFFIX_URL_GENERAL_INFORMATION}`,
      IE: `${PREFIX_GUIDES_URL}en-ie-documentation-web-cloud-domains${SUFFIX_URL_GENERAL_INFORMATION}`,
      IT: `${PREFIX_GUIDES_URL}it-documentation-web-cloud-domains${SUFFIX_URL_GENERAL_INFORMATION}`,
      PL: `${PREFIX_GUIDES_URL}pl-documentation-web-cloud-domains${SUFFIX_URL_GENERAL_INFORMATION}`,
      PT: `${PREFIX_GUIDES_URL}pt-documentation-web-cloud-domains${SUFFIX_URL_GENERAL_INFORMATION}`,
      GB: `${PREFIX_GUIDES_URL}en-gb-documentation-web-cloud-domains${SUFFIX_URL_GENERAL_INFORMATION}`,
      CA: `${PREFIX_GUIDES_URL}en-ca-documentation-web-cloud-domains${SUFFIX_URL_GENERAL_INFORMATION}`,
      QC: `${PREFIX_GUIDES_URL}fr-ca-documentation-web-cloud-domains${SUFFIX_URL_GENERAL_INFORMATION}`,
      MA: `${PREFIX_GUIDES_URL}fr-ma-documentation-web-cloud-domains${SUFFIX_URL_GENERAL_INFORMATION}`,
      SN: `${PREFIX_GUIDES_URL}fr-sn-documentation-web-cloud-domains${SUFFIX_URL_GENERAL_INFORMATION}`,
      TN: `${PREFIX_GUIDES_URL}fr-tn-documentation-web-cloud-domains${SUFFIX_URL_GENERAL_INFORMATION}`,
      AU: `${PREFIX_GUIDES_URL}en-au-documentation-web-cloud-domains${SUFFIX_URL_GENERAL_INFORMATION}`,
      SG: `${PREFIX_GUIDES_URL}en-sg-documentation-web-cloud-domains${SUFFIX_URL_GENERAL_INFORMATION}`,
      FR: `${PREFIX_GUIDES_URL}fr-documentation-web-cloud-domains${SUFFIX_URL_GENERAL_INFORMATION}`,
      WE: `${PREFIX_GUIDES_URL}world-documentation-web-cloud-domains${SUFFIX_URL_GENERAL_INFORMATION}`,
      WS: `${PREFIX_GUIDES_URL}es-documentation-web-cloud-domains${SUFFIX_URL_GENERAL_INFORMATION}`,
    },
  },
];

export default {
  DOMAIN_COLUMN_DNSSEC,
  DOMAIN_OBJECT_KEYS,
  DOMAIN_STATUS,
  DOMAIN_RENEWABLE_STATE,
  DOMAIN_SUSPENSION_STATE,
  DOMAIN_SUSPENSION_STATE_CLASS,
  DOMAIN_TRANSFER_LOCK_STATE,
  DOMAIN_TRANSFER_LOCK_STATE_CLASS,
  DOMAIN_DNSSEC_STATE,
  DOMAIN_DNSSEC_STATE_CLASS,
  DOMAIN_NAME_SERVER_TYPE,
  DOMAINS_BADGES_STATUS,
  DOMAINS_BADGES_RENEWAL_MODE,
  IDN_PREFIX,
  LANGUAGE_OVERRIDE,
  DATE_FORMAT,
  MONTH_DATE_FORMAT,
  PRODUCT_TYPE,
  DOMAINS_GUIDES,
};
