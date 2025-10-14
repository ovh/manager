import { OvhSubsidiary } from '@ovh-ux/manager-react-components';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import {
  DashboardItem,
  DashboardItemConfig,
} from './data/types/dashboard.type';

export const QUOTA_THRESHOLD = 80;

export const ROADMAP_CHANGELOG_LINKS = {
  changelog: 'https://github.com/orgs/ovh/projects/16/views/6?pane=info',
  roadmap: 'https://github.com/ovh/public-cloud-roadmap/projects',
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
  BILLING_CHANGE_MEDIATION_BANNER_2:
    'public-cloud:project:billing-change-mediation-banner_2',

  // Project Settings
  USERS: 'public-cloud:users',
  QUOTA: 'public-cloud:quota',
  REGION: 'public-cloud:region',
  SSH_KEYS: 'public-cloud:ssh-keys',
  BILLING: 'public-cloud:billing',
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

export type TFeatureStateDetail = {
  url: string;
  targetParamKeys?: string[];
  isExternal?: boolean;
  featureAvailability?: string;
};

export type TFeatureState = {
  [key: string]: {
    [key: string]: TFeatureStateDetail;
  };
};

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

const OVH_CLOUD_URL = 'https://www.ovhcloud.com';

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

// Function to get HDS info URL for a given subsidiary with automatic fallback
export const getHdsInfoUrl = (subsidiary: OvhSubsidiary): string => {
  const HDS_URL = 'enterprise/certification-conformity/hds/';
  const language = OVH_LANGUAGE_BY_SUBSIDIARY[subsidiary];
  return `${OVH_CLOUD_URL}/${language}/${HDS_URL}`;
};

export const PCI_FEATURES_STATES: TFeatureState = {
  DATAPLATFORM: {
    LIST: {
      url:
        'https://hq-api.eu.dataplatform.ovh.net/iam/v4/login?authentication_provider=ovh&project=:projectId&app_id=forepaas&response_type=token&redirect_uri=https%3A%2F%2Feu.dataplatform.ovh.net&authorize_bypass=true&token_mode=cookie&force_auth=false',
      isExternal: true,
    },
  },
  INSTANCES: {
    LIST: { url: `${BASE_PROJECT_PATH}/instances` },
    ADD: { url: `${BASE_PROJECT_PATH}/instances/new` },
  },
  BAREMETAL: {
    LIST: { url: `${BASE_PROJECT_PATH}/instances` },
    ADD: { url: `${BASE_PROJECT_PATH}/instances/new?c=baremetal` },
  },
  BLOCKS: {
    LIST: { url: `${BASE_PROJECT_PATH}/storages/blocks` },
    ADD: { url: `${BASE_PROJECT_PATH}/storages/blocks/new` },
  },
  VOLUME_BACKUP: {
    LIST: { url: `${BASE_PROJECT_PATH}/storages/volume-backup` },
    ADD: { url: `${BASE_PROJECT_PATH}/storages/volume-backup/create` },
  },
  OBJECTS: {
    LIST: { url: `${BASE_PROJECT_PATH}/storages/objects` },
    ADD: { url: `${BASE_PROJECT_PATH}/storages/objects/new` },
  },
  DATABASES: {
    LIST: {
      url: `${BASE_PROJECT_PATH}/databases-analytics/operational/services/new`,
      targetParamKeys: ['steps'],
      featureAvailability: FEATURE_AVAILABILITY.DATABASES_ANALYTICS,
    },
    ADD: {
      url: `${BASE_PROJECT_PATH}/databases-analytics/operational/services/new`,
      targetParamKeys: ['steps'],
      featureAvailability: FEATURE_AVAILABILITY.DATABASES_ANALYTICS,
    },
  },
  ARCHIVES: {
    LIST: { url: `${BASE_PROJECT_PATH}/storages/cloud-archives` },
    ADD: { url: `${BASE_PROJECT_PATH}/storages/cloud-archives/new` },
  },
  SNAPSHOTS: {
    LIST: { url: `${BASE_PROJECT_PATH}/storages/volume-snapshots` },
    ADD: {
      url: `${BASE_PROJECT_PATH}/storages/volume-snapshots/:snapshotId/new-volume`,
    },
  },
  CONTAINERS: {
    LIST: { url: `${BASE_PROJECT_PATH}/storages/cold-archive` },
    ADD: { url: `${BASE_PROJECT_PATH}/storages/cold-archive/new` },
  },
  LOADBALANCER: {
    LIST: { url: `${BASE_PROJECT_PATH}/octavia-load-balancer` },
  },
  PRIVATE_NETWORK: {
    LIST: { url: `${BASE_PROJECT_PATH}/private-networks` },
    ADD: { url: `${BASE_PROJECT_PATH}/private-networks/new` },
  },
  KUBERNETES: {
    LIST: { url: `${BASE_PROJECT_PATH}/kubernetes` },
    ADD: { url: `${BASE_PROJECT_PATH}/kubernetes/new` },
  },
  PRIVATE_REGISTRY: {
    LIST: { url: `${BASE_PROJECT_PATH}/private-registry` },
    ADD: { url: `${BASE_PROJECT_PATH}/private-registry/create` },
  },
  WORKFLOW: {
    LIST: { url: `${BASE_PROJECT_PATH}/workflow` },
    ADD: { url: `${BASE_PROJECT_PATH}/workflow/new` },
  },
  NOTEBOOKS: {
    LIST: { url: `${BASE_PROJECT_PATH}/ai-ml/notebooks` },
    ADD: { url: `${BASE_PROJECT_PATH}/ai-ml/notebooks/new` },
  },
  TRAINING: {
    LIST: { url: `${BASE_PROJECT_PATH}/ai-ml/training` },
    ADD: { url: `${BASE_PROJECT_PATH}/ai-ml/training/new` },
  },
  DATA_PROCESSING: {
    LIST: { url: `${BASE_PROJECT_PATH}/data-processing/jobs` },
    ADD: { url: `${BASE_PROJECT_PATH}/data-processing/jobs/submit-job` },
  },
  PROJECT_MANAGEMENT: {
    QUOTA_AND_REGIONS: { url: `${BASE_PROJECT_PATH}/quota` },
    SSH_KEYS: { url: `${BASE_PROJECT_PATH}/ssh` },
    BILLING_CONTROL: { url: `${BASE_PROJECT_PATH}/billing` },
    CREDIT_AND_VOUCHERS: { url: `${BASE_PROJECT_PATH}/vouchers` },
    CONTACTS_AND_RIGHTS: { url: `${BASE_PROJECT_PATH}/contacts` },
    PROJECT_SETTINGS: { url: `${BASE_PROJECT_PATH}/edit` },
  },
};

export const SUPPORT_URL = `${DOC_BASE_URL}?id=csm_get_help&ovhSubsidiary=`;

export const PCI_PROJECT_ORDER_CART = {
  productName: 'cloud',
  planCode: 'project.2018',
  infraConfigValue: 'production',
  creditPlanCode: 'credit',
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

// Function to get documentation guide URL for a given guide and subsidiary
export const getDocumentationGuideLink = (
  guideName: string,
  subsidiary: OvhSubsidiary,
): string => {
  const language = OVH_LANGUAGE_BY_SUBSIDIARY[subsidiary];

  // Special case for guides - uses csm_index instead of KB article
  if (guideName === 'guides') {
    return `${DOC_BASE_URL}/${language}-home?id=csm_index`;
  }

  // KB Article IDs for documentation guides by subsidiary
  const DOCUMENTATION_KB_BY_SUB: Record<
    string,
    Partial<Record<OvhSubsidiary, string>>
  > = {
    getting_started: {
      DEFAULT: 'KB0050388', // en-gb
      DE: 'KB0050383', // de
      ES: 'KB0050389', // es-es
      FR: 'KB0050407', // fr
      IE: 'KB0050387', // en-ie
      IT: 'KB0050404', // it
      PL: 'KB0050394', // pl
      PT: 'KB0050395', // pt
      CA: 'KB0050398', // en-ca
      QC: 'KB0050397', // fr-ca
      WS: 'KB0050392', // es
      AU: 'KB0038069', // en-au
      IN: 'KB0069446', // en-in
      SG: 'KB0050393', // en-sg
      ASIA: 'KB0050384', // asia
    },
    public_cloud: {
      DEFAULT: 'KB0050399', // en-gb
      DE: 'KB0050396', // de
      ES: 'KB0050416', // es-es
      FR: 'KB0050409', // fr
      IE: 'KB0050401', // en-ie
      IT: 'KB0050403', // it
      PL: 'KB0050406', // pl
      PT: 'KB0050411', // pt
      CA: 'KB0050400', // en-ca
      QC: 'KB0050408', // fr-ca
      WS: 'KB0050417', // es
      AU: 'KB0050410', // en-au
      IN: 'KB0069451', // en-in
      SG: 'KB0050402', // en-sg
      ASIA: 'KB0038083', // asia
    },
    instances: {
      DEFAULT: 'KB0050758', // en-gb
      DE: 'KB0050755', // de
      ES: 'KB0050761', // es-es
      FR: 'KB0050764', // fr
      IE: 'KB0050766', // en-ie
      IT: 'KB0050765', // it
      PL: 'KB0050768', // pl
      PT: 'KB0050776', // pt
      CA: 'KB0050754', // en-ca
      QC: 'KB0050762', // fr-ca
      WS: 'KB0050760', // es
      AU: 'KB0050756', // en-au
      IN: 'KB0069231', // en-in
      SG: 'KB0050759', // en-sg
      ASIA: 'KB0038462', // asia
    },
    billing: {
      DEFAULT: 'KB0050453', // en-gb
      DE: 'KB0050448', // de
      ES: 'KB0050457', // es-es
      FR: 'KB0050459', // fr
      IE: 'KB0050454', // en-ie
      IT: 'KB0050461', // it
      PL: 'KB0050472', // pl
      PT: 'KB0050474', // pt
      CA: 'KB0050452', // en-ca
      QC: 'KB0050460', // fr-ca
      WS: 'KB0050462', // es
      AU: 'KB0038140', // en-au
      IN: 'KB0069450', // en-in
      SG: 'KB0050465', // en-sg
      ASIA: 'KB0050463', // asia
    },
  };

  const kbId =
    DOCUMENTATION_KB_BY_SUB[guideName]?.[subsidiary] ||
    DOCUMENTATION_KB_BY_SUB[guideName]?.DEFAULT;

  // Map guide names to their specific paths
  const guidePaths: Record<string, string> = {
    getting_started: 'public-cloud-compute-essential-information',
    public_cloud: 'public-cloud-compute-control-panel',
    instances: 'public-cloud-compute-getting-started-instance',
    billing: 'public-cloud-compute-billing-options',
  };

  const path = guidePaths[guideName];
  return `${DOC_BASE_URL}/${language}-${path}?id=kb_article_view&sysparm_article=${kbId}`;
};

export const DASHBOARD_DOCUMENTATION_LINKS_CONFIG: DashboardItemConfig[] = [
  {
    labelTranslationKey: 'pci_projects_home_getting_started',
    linkLabelTranslationKey: 'pci_projects_home_essential_to_start',
    documentationGuideKey: 'getting_started',
    featureFlag: FEATURE_AVAILABILITY.CLOUD_ESSENTIAL_INFORMATION,
  },
  {
    labelTranslationKey: 'pci_projects_home_public_cloud',
    linkLabelTranslationKey: 'pci_projects_home_get_familiar',
    documentationGuideKey: 'public_cloud',
    featureFlag: FEATURE_AVAILABILITY.PUBLIC_CLOUD_INTERFACE,
  },
  {
    labelTranslationKey: 'pci_projects_home_instances',
    linkLabelTranslationKey: 'pci_projects_home_manage_instances',
    documentationGuideKey: 'instances',
    featureFlag: FEATURE_AVAILABILITY.START_PCI_INSTANCE,
  },
  {
    labelTranslationKey: 'pci_projects_home_billing',
    linkLabelTranslationKey: 'pci_projects_home_understand_manage',
    documentationGuideKey: 'billing',
    featureFlag: FEATURE_AVAILABILITY.CLOUD_BILLING_OPTIONS,
  },
  {
    labelTranslationKey: 'pci_projects_home_guides',
    linkLabelTranslationKey: 'pci_projects_home_see_all_guides',
    documentationGuideKey: 'guides',
    featureFlag: FEATURE_AVAILABILITY.ALL_GUIDES,
  },
];

// Developer Center URL construction (now uses centralized LANGUAGE_MAPPINGS)
export const DASHBOARD_COMMUNITY_LINKS: DashboardItem[] = [
  {
    labelTranslationKey: 'pci_projects_home_roadmap',
    linkLabelTranslationKey: 'pci_projects_home_discover_participate',
    link: ROADMAP_CHANGELOG_LINKS.roadmap,
  },
  {
    labelTranslationKey: 'pci_projects_home_community',
  },
  {
    labelTranslationKey: '',
    linkLabelTranslationKey: 'pci_projects_home_discuss_discord',
    link: 'https://discord.gg/ovhcloud',
  },
];

export const DASHBOARD_CREDIT_VOUCHER_LINK: DashboardItem = {
  linkLabelTranslationKey: 'pci_projects_home_credits_vouchers',
  link: '/vouchers',
  color: 'primary',
  iconODS: ODS_ICON_NAME.arrowRight,
  ariaLabelTranslationKey: 'pci_projects_home_link_credits_vouchers_aria',
  hideTileIfNoOtherItems: true,
};

// Quick Access Items - Base configuration without iconImage (will be added in component)
export const DASHBOARD_QUICK_ACCESS_ITEMS_BASE: DashboardItem[] = [
  {
    labelTranslationKey: 'pci_projects_home_instances',
    descriptionTranslationKey: 'pci_projects_home_create_instance',
    link: PCI_FEATURES_STATES.INSTANCES.LIST.url,
    featureFlag: FEATURE_AVAILABILITY.INSTANCE,
  },
  {
    labelTranslationKey: 'pci_projects_home_kubernetes',
    descriptionTranslationKey: 'pci_projects_home_create_cluster',
    link: PCI_FEATURES_STATES.KUBERNETES.LIST.url,
    featureFlag: FEATURE_AVAILABILITY.KUBERNETES,
  },
  {
    labelTranslationKey: 'pci_projects_home_object_storage',
    descriptionTranslationKey: 'pci_projects_home_create_container',
    link: PCI_FEATURES_STATES.OBJECTS.LIST.url,
    featureFlag: FEATURE_AVAILABILITY.OBJECT_STORAGE,
  },
  {
    labelTranslationKey: 'pci_projects_home_block_storage',
    descriptionTranslationKey: 'pci_projects_home_create_volume',
    link: PCI_FEATURES_STATES.BLOCKS.LIST.url,
    featureFlag: FEATURE_AVAILABILITY.BLOCK_STORAGE,
  },
  {
    labelTranslationKey: 'pci_projects_home_network',
    descriptionTranslationKey: 'pci_projects_home_manage_vrack',
    link: PCI_FEATURES_STATES.PRIVATE_NETWORK.LIST.url,
    featureFlag: FEATURE_AVAILABILITY.PRIVATE_NETWORK,
  },
  {
    labelTranslationKey: 'pci_projects_home_database',
    descriptionTranslationKey: 'pci_projects_home_create_database',
    link: PCI_FEATURES_STATES.DATABASES.ADD.url,
    featureFlag: FEATURE_AVAILABILITY.DATABASES,
  },
];

export const DASHBOARD_OTHER_ACTIONS_ITEMS: DashboardItem[] = [
  {
    iconODS: ODS_ICON_NAME.book,
    labelTranslationKey: 'pci_projects_home_create_ai_notebook',
    link: PCI_FEATURES_STATES.NOTEBOOKS.LIST.url,
    featureFlag: FEATURE_AVAILABILITY.NOTEBOOKS,
  },
  {
    iconODS: ODS_ICON_NAME.network,
    labelTranslationKey: 'pci_projects_home_create_load_balancer',
    link: PCI_FEATURES_STATES.LOADBALANCER.LIST.url,
    featureFlag: FEATURE_AVAILABILITY.LOAD_BALANCER,
  },
  {
    iconODS: ODS_ICON_NAME.bill,
    labelTranslationKey: 'pci_projects_home_billing',
    link: PCI_FEATURES_STATES.PROJECT_MANAGEMENT.BILLING_CONTROL.url,
    featureFlag: FEATURE_AVAILABILITY.BILLING,
  },
  {
    iconODS: ODS_ICON_NAME.cog,
    labelTranslationKey: 'pci_projects_home_quotas',
    link: PCI_FEATURES_STATES.PROJECT_MANAGEMENT.QUOTA_AND_REGIONS.url,
    featureFlag: FEATURE_AVAILABILITY.QUOTA,
  },
];
const OVH_DOCS_URL = 'https://docs.ovh.com';
export const CREATING_GUIDE_URLS: Record<string, string> = {
  DE: `${OVH_DOCS_URL}/de/public-cloud/`,
  CZ: `${OVH_DOCS_URL}/cz/cs/public-cloud/`,
  ASIA: `${OVH_DOCS_URL}/asia/en/public-cloud/`,
  AU: `${OVH_DOCS_URL}/au/en/public-cloud/`,
  GB: `${OVH_DOCS_URL}/gb/en/public-cloud/`,
  IE: `${OVH_DOCS_URL}/ie/en/public-cloud/`,
  SG: `${OVH_DOCS_URL}/sg/en/public-cloud/`,
  US: `${OVH_DOCS_URL}/us/en/public-cloud/`,
  ES: `${OVH_DOCS_URL}/es/public-cloud/`,
  FI: `${OVH_DOCS_URL}/fi/public-cloud/`,
  CA: `${OVH_DOCS_URL}/ca/fr/public-cloud/`,
  FR: `${OVH_DOCS_URL}/fr/public-cloud/`,
  IT: `${OVH_DOCS_URL}/it/public-cloud/`,
  LT: `${OVH_DOCS_URL}/lt/public-cloud/`,
  NL: `${OVH_DOCS_URL}/nl/public-cloud/`,
  PL: `${OVH_DOCS_URL}/pl/public-cloud/`,
  PT: `${OVH_DOCS_URL}/pt/public-cloud/`,
};

const HELP_OVH_CLOUD_URL = 'https://help.ovhcloud.com';
const PUBLIC_CLOUD_COMPUTE_ESSENTIAL_INFORMATION =
  'public-cloud-compute-essential-information?id=kb_article_view&sysparm_article';

export const UPDATING_GUIDE_URLS: Record<string, string> = {
  DEFAULT: `${HELP_OVH_CLOUD_URL}/csm/en-${PUBLIC_CLOUD_COMPUTE_ESSENTIAL_INFORMATION}=KB0050390`,
  ASIA: `${HELP_OVH_CLOUD_URL}/csm/asia-${PUBLIC_CLOUD_COMPUTE_ESSENTIAL_INFORMATION}=KB0050384`,
  AU: `${HELP_OVH_CLOUD_URL}/csm/en-au-${PUBLIC_CLOUD_COMPUTE_ESSENTIAL_INFORMATION}=KB0038069`,
  CA: `${HELP_OVH_CLOUD_URL}/csm/en-ca-${PUBLIC_CLOUD_COMPUTE_ESSENTIAL_INFORMATION}=KB0050398`,
  DE: `${HELP_OVH_CLOUD_URL}/csm/de-${PUBLIC_CLOUD_COMPUTE_ESSENTIAL_INFORMATION}=KB0050383`,
  ES: `${HELP_OVH_CLOUD_URL}/csm/es-es-${PUBLIC_CLOUD_COMPUTE_ESSENTIAL_INFORMATION}=KB0050389`,
  EU: `${HELP_OVH_CLOUD_URL}/csm/en-ie-${PUBLIC_CLOUD_COMPUTE_ESSENTIAL_INFORMATION}=KB0050387`,
  FR: `${HELP_OVH_CLOUD_URL}/csm/fr-${PUBLIC_CLOUD_COMPUTE_ESSENTIAL_INFORMATION}=KB0050407`,
  GB: `${HELP_OVH_CLOUD_URL}/csm/en-gb-${PUBLIC_CLOUD_COMPUTE_ESSENTIAL_INFORMATION}=KB0050388`,
  IE: `${HELP_OVH_CLOUD_URL}/csm/en-ie-${PUBLIC_CLOUD_COMPUTE_ESSENTIAL_INFORMATION}=KB0050387`,
  IN: `${HELP_OVH_CLOUD_URL}/csm/asia-${PUBLIC_CLOUD_COMPUTE_ESSENTIAL_INFORMATION}=KB0050384`,
  IT: `${HELP_OVH_CLOUD_URL}/csm/it-${PUBLIC_CLOUD_COMPUTE_ESSENTIAL_INFORMATION}=KB0050404`,
  MA: `${HELP_OVH_CLOUD_URL}/csm/fr-${PUBLIC_CLOUD_COMPUTE_ESSENTIAL_INFORMATION}=KB0050407`,
  NL: `${HELP_OVH_CLOUD_URL}/csm/en-nl-documentation-public-cloud?id=kb_browse_cat&kb_id=574a8325551974502d4c6e78b7421938`,
  PL: `${HELP_OVH_CLOUD_URL}/csm/pl-${PUBLIC_CLOUD_COMPUTE_ESSENTIAL_INFORMATION}=KB0050394`,
  PT: `${HELP_OVH_CLOUD_URL}/csm/pt-${PUBLIC_CLOUD_COMPUTE_ESSENTIAL_INFORMATION}=KB0050395`,
  QC: `${HELP_OVH_CLOUD_URL}/csm/fr-ca-${PUBLIC_CLOUD_COMPUTE_ESSENTIAL_INFORMATION}=KB0050397`,
  SG: `${HELP_OVH_CLOUD_URL}/csm/en-sg-${PUBLIC_CLOUD_COMPUTE_ESSENTIAL_INFORMATION}=KB0050393`,
  SN: `${HELP_OVH_CLOUD_URL}/csm/fr-${PUBLIC_CLOUD_COMPUTE_ESSENTIAL_INFORMATION}=KB0050407`,
  TN: `${HELP_OVH_CLOUD_URL}/csm/fr-${PUBLIC_CLOUD_COMPUTE_ESSENTIAL_INFORMATION}=KB0050407`,
  US: `https://support.us.ovhcloud.com/hc/en-us/articles/20644404016787-All-You-Need-to-Know-to-Get-Started-with-Public-Cloud`,
  WE: `${HELP_OVH_CLOUD_URL}/csm/en-${PUBLIC_CLOUD_COMPUTE_ESSENTIAL_INFORMATION}=KB0050390`,
  WS: `${HELP_OVH_CLOUD_URL}/csm/es-${PUBLIC_CLOUD_COMPUTE_ESSENTIAL_INFORMATION}=KB0050392`,
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
