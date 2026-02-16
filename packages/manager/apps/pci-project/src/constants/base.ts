import { OvhSubsidiary } from '@ovh-ux/manager-react-components';

export const QUOTA_THRESHOLD = 80;

export type ChangelogLinks = {
  changelog: string;
  roadmap: string;
  'feature-request': string;
};

export const CHANGELOG_LINKS: ChangelogLinks = {
  changelog: 'https://github.com/orgs/ovh/projects/16/views/6?pane=info',
  roadmap: 'https://github.com/orgs/ovh/projects/16/views/1?pane=info',
  'feature-request':
    'https://github.com/ovh/public-cloud-roadmap/issues/new?assignees=&labels=&projects=&template=feature_request.md&title=',
};

export const FEATURE_AVAILABILITY = {
  // Products
  INSTANCE: 'instance',
  KUBERNETES: 'kubernetes',
  OBJECT_STORAGE: 'object-storage',
  BLOCK_STORAGE: 'block-storage',
  DATABASES: 'databases',
  PRIVATE_NETWORK: 'private-network',
  FAILOVER_IP: 'failover-ip',
  LOAD_BALANCER: 'load-balancer',
  NOTEBOOKS: 'pci-ai-notebooks',
  DATA_PLATFORM: 'pci-dataplatform',

  // Documentation Links
  CLOUD_ESSENTIAL_INFORMATION: 'public-cloud:link-cloud-essential-information',
  PUBLIC_CLOUD_INTERFACE: 'public-cloud:link-public-cloud-interface',
  START_PCI_INSTANCE: 'public-cloud:link-start-public-cloud-instance',
  CLOUD_BILLING_OPTIONS: 'public-cloud:link-cloud-billing-options',
  ALL_GUIDES: 'public-cloud:link-all-guides',
  START_WITH_BLOCK_STORAGE: 'public-cloud:link-start-with-block-storage',

  // Banners
  BILLING_CHANGE_MEDIATION_BANNER_2: 'public-cloud:project:billing-change-mediation-banner_2',

  // Project Settings
  USERS: 'public-cloud:users',
  QUOTA: 'public-cloud:quota',
  REGION: 'public-cloud:region',
  SSH_KEYS: 'public-cloud:ssh-keys',
  BILLING: 'pci-billing',
  VOUCHERS: 'public-cloud:vouchers',
  CONTACTS: 'public-cloud:contacts',
  PROJECT: 'public-cloud:project',
  PROJECT_SETTINGS: 'public-cloud:project-settings',

  // Existing features
  SAVINGS_PLAN: 'pci-savings-plan',
  DATABASES_ANALYTICS: 'pci-databases-analytics',
  HDS: 'public-cloud:hds',
};

export const ITALY_AGREEMENT_TEXT = {
  TITLE:
    "Il Cliente dichiara di riconoscere, accettare ed approvare espressamente, ai sensi dell'art. 1341, secondo comma, e dell'art. 1342, secondo comma, del Codice Civile",
  LINK: 'Le specifiche clausole indicate qui',
  DETAILS:
    "Il Cliente dichiara di riconoscere, accettare ed approvare espressamente, ai sensi dell'art. 1341, secondo comma, e dell'art. 1342, secondo comma, del Codice Civile, le seguenti specifiche clausole del presente Contratto: 2.5 (“Chiusura dell’Account Cliente”), 3.7 (“Sospensione dei Servizi”), 4.2 (“SLA”), 4.3 (“Crediti di servizio”), 5.2 (“Modifica dei Servizi ordinati”), 7.1 (“Casi di e-mail fraudolente e indesiderate”), 7.3 (“Sospensione e disattivazione”), 10.2 (“Responsabilità di OVHcloud”), 10.3 (“Limitazioni di responsabilità”), 10.4 (“Eccezioni”), 10.6 (“Responsabilità del Cliente”), 10.7 (“Garanzie”), 10.8 (“Forza Maggiore”), 11.2 (“Modifica delle tariffe”), 11.6 (“Mancato pagamento e ritardo nel pagamento”), 11.7 (“Contestazione”), 12.2 (“Rinnovo dei Servizi”), 14.1 (“Legge applicabile e foro competente”), 14.2, ult. cpv. (“Sanzioni internazionali e Controllo delle esportazioni”), 14.7 (“Modifiche al Contratto”), 14.9 (“Cessione del contratto”).",
};

export const DOC_BASE_URL = 'https://help.ovhcloud.com/csm';

export const INDIAN_KYC_SUPPORT_LINK = `${DOC_BASE_URL}?id=csm_cases_requests&ovhSubsidiary=IN`;

export const PCI_HDS_ADDON = {
  productName: 'cloud',
  family: 'certification-hds',
  parentPlanCode: 'project.2018',
  planCodeScope: 'certification.hds',
  certifiedProject: 'publiccloud-certification-hds',
  planCode: 'certification.hds.2018',
};

export const PCI_HDS_DISCOVERY_ADDON = {
  parentPlanCode: 'project.discovery',
};

export const DISCOVERY_PROJECT_PLANCODE = 'project.discovery';

export const ORDER_FOLLOW_UP_POLLING_INTERVAL = 7000;
export const ORDER_FOLLOW_UP_STATUS_ENUM = {
  DOING: 'DOING',
  DONE: 'DONE',
  ERROR: 'ERROR',
  TODO: 'TODO',
};
export const ORDER_FOLLOW_UP_STEP_ENUM = {
  AVAILABLE: 'AVAILABLE',
  DELIVERING: 'DELIVERING',
  VALIDATED: 'VALIDATED',
  VALIDATING: 'VALIDATING',
};

export const BASE_PROJECT_PATH = '#/pci/projects/:projectId';

export const OVH_CLOUD_URL = 'https://www.ovhcloud.com';

// Global language mappings for subsidiaries
export const OVH_LANGUAGE_BY_SUBSIDIARY: Record<OvhSubsidiary, string> = {
  DEFAULT: 'en',
  ASIA: 'asia',
  AU: 'en-au',
  CA: 'en-ca',
  CZ: 'cs',
  DE: 'de',
  ES: 'es-es',
  EU: 'en',
  FI: 'fi',
  FR: 'fr',
  GB: 'en-gb',
  IE: 'en-ie',
  IN: 'en-in',
  IT: 'it',
  LT: 'lt',
  MA: 'fr-ma',
  NL: 'nl',
  PL: 'pl',
  PT: 'pt',
  QC: 'fr-ca',
  SG: 'en-sg',
  SN: 'fr-sn',
  TN: 'fr-tn',
  US: 'en-us',
  WE: 'en',
  WS: 'es',
};

export const SUPPORT_URL = `${DOC_BASE_URL}?id=csm_get_help&ovhSubsidiary=`;

export const PCI_PROJECT_ORDER_CART = {
  productName: 'cloud',
  planCode: 'project.2018',
  infraConfigValue: 'production',
  creditPlanCode: 'credit',
};

export const CREDIT_ORDER_CART = {
  projectPlanCode: 'project.2018',
  planCode: 'cloud.credit',
};

export const PCI_PROJECT_DISCOVERY_ORDER_CART = {
  productName: 'cloud',
  planCode: 'project.discovery',
  infraConfigValue: 'production',
  creditPlanCode: 'credit',
};

export const ANTI_FRAUD = {
  CASE_FRAUD_REFUSED: '(error 906)',
  POLLING_INTERVAL: 2000,
};

export enum AntiFraudError {
  NEED_CUSTOMER_INFO_CHECK = 'antifraud_customer_info_check_needed',
  CASE_FRAUD_REFUSED = 'antifraud_refused',
  UNKNOWN = 'antifraud_unknown',
}

export const STARTUP_PROGRAM_GUIDE_URL =
  'https://community.ovhcloud.com/community/en/what-products-are-available-to-use-with-startup-program-credits?id=community_question&sys_id=99d01d508d61d2902d4cc9575bde90ae&view_source=featuredList';

// Legacy QUOTA_LIMIT_GUIDES - kept for backward compatibility
const INCREASE_QUOTA_URL =
  '-public-cloud-compute-increase-quota?id=kb_article_view&sysparm_article=';
export const QUOTA_LIMIT_GUIDES: Partial<{ [key in OvhSubsidiary]: string }> = {
  GB: `${DOC_BASE_URL}/en-gb${INCREASE_QUOTA_URL}KB0050843`,
  IE: `${DOC_BASE_URL}/en-ie${INCREASE_QUOTA_URL}KB0050840`,
  DEFAULT: `${DOC_BASE_URL}/en-gb${INCREASE_QUOTA_URL}KB0050843`,
  ASIA: `${DOC_BASE_URL}/asia${INCREASE_QUOTA_URL}KB0050836`,
  AU: `${DOC_BASE_URL}/en-au${INCREASE_QUOTA_URL}KB0050838`,
  CA: `${DOC_BASE_URL}/en-ca${INCREASE_QUOTA_URL}KB0050852`,
  SG: `${DOC_BASE_URL}/en-sg${INCREASE_QUOTA_URL}KB0050844`,
  WE: `${DOC_BASE_URL}/en-${INCREASE_QUOTA_URL}KB0050845`,
  IN: `${DOC_BASE_URL}/asia${INCREASE_QUOTA_URL}KB0050836`,
  FR: `${DOC_BASE_URL}/fr${INCREASE_QUOTA_URL}KB0050857`,
};

export const UCENTS = 1 / 100_000_000;

export const PAYPAL_BUTTON_OPTIONS = {
  env: import.meta.env.PROD ? 'production' : 'sandbox',
  commit: true,
  locale: 'fr_FR',
  style: {
    color: 'blue',
    label: 'paypal',
    shape: 'rect',
    size: 'medium',
    tagline: false,
  },
};

export const PAYPAL_SCRIPT = {
  src: 'https://www.paypalobjects.com/api/checkout.js',
  id: 'paypal_checkout_script',
};

export const SLIDE_ANIMATION_INTERVAL = 5000;
export const DISCOVERY_PROMOTION_VOUCHER = 'FREETRIAL';

export const FULL_PROJECT_PLAN_CODE = 'project.2018';

export const DISCOVERY_PROJECT_ACTIVATION_PAYLOAD = {
  autoPayWithPreferredPaymentMethod: true,
  duration: 'P1M',
  pricingMode: 'default',
  quantity: 1,
};
