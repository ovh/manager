import { OvhSubsidiary } from '@ovh-ux/manager-react-components';
import { CountryCode } from '@ovh-ux/manager-config';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';

export const QUOTA_THRESHOLD = 80;

export const ROADMAP_CHANGELOG_LINKS = {
  changelog: 'https://github.com/orgs/ovh/projects/16/views/6?pane=info',
  roadmap:
    'https://github.com/ovh/public-cloud-roadmap/projects?query=is%3Aopen',
  'feature-request':
    'https://github.com/ovh/public-cloud-roadmap/issues/new?assignees=&labels=&projects=&template=feature_request.md&title=',
};

export const FEATURE_AVAILABILITY = {
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

export const INDIAN_KYC_SUPPORT_LINK =
  'https://help.ovhcloud.com/csm?id=csm_cases_requests&ovhSubsidiary=IN';

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

export const BASE_PROJECT_PATH = '#/pci/projects/:projectId';

const OVH_CLOUD_URL = 'https://www.ovhcloud.com';
const HDS_URL = 'enterprise/certification-conformity/hds/';

type HdsInfo = { [key in OvhSubsidiary]: string };

// Legacy HDS_INFO - kept for backward compatibility
export const HDS_INFO: Partial<HdsInfo> = {
  DEFAULT: `${OVH_CLOUD_URL}/en/${HDS_URL}`,
  ASIA: `${OVH_CLOUD_URL}/asia/${HDS_URL}`,
  AU: `${OVH_CLOUD_URL}/en-au/${HDS_URL}`,
  CA: `${OVH_CLOUD_URL}/en-ca/${HDS_URL}`,
  DE: `${OVH_CLOUD_URL}/de/${HDS_URL}`,
  ES: `${OVH_CLOUD_URL}/es-es/${HDS_URL}`,
  FR: `${OVH_CLOUD_URL}/fr/${HDS_URL}`,
  GB: `${OVH_CLOUD_URL}/en-gb/${HDS_URL}`,
  IE: `${OVH_CLOUD_URL}/en-ie/${HDS_URL}`,
  IT: `${OVH_CLOUD_URL}/it/${HDS_URL}`,
  MA: `${OVH_CLOUD_URL}/fr-ma/${HDS_URL}`,
  NL: `${OVH_CLOUD_URL}/nl/${HDS_URL}`,
  PL: `${OVH_CLOUD_URL}/pl/${HDS_URL}`,
  PT: `${OVH_CLOUD_URL}/pt/${HDS_URL}`,
  QC: `${OVH_CLOUD_URL}/fr-ca/${HDS_URL}`,
  SG: `${OVH_CLOUD_URL}/en-sg/${HDS_URL}`,
  SN: `${OVH_CLOUD_URL}/fr-sn/${HDS_URL}`,
  TN: `${OVH_CLOUD_URL}/fr-tn/${HDS_URL}`,
  WE: `${OVH_CLOUD_URL}/en/${HDS_URL}`,
  WS: `${OVH_CLOUD_URL}/es/${HDS_URL}`,
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

export const SUPPORT_URL =
  'https://help.ovhcloud.com/csm?id=csm_get_help&ovhSubsidiary=';

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
export const QUOTA_LIMIT_GUIDES: Partial<{ [key in OvhSubsidiary]: string }> = {
  GB:
    'https://help.ovhcloud.com/csm/en-gb-public-cloud-compute-increase-quota?id=kb_article_view&sysparm_article=KB0050843',
  IE:
    'https://help.ovhcloud.com/csm/en-ie-public-cloud-compute-increase-quota?id=kb_article_view&sysparm_article=KB0050840',
  DEFAULT:
    'https://help.ovhcloud.com/csm/en-gb-public-cloud-compute-increase-quota?id=kb_article_view&sysparm_article=KB0050843',
  ASIA:
    'https://help.ovhcloud.com/csm/asia-public-cloud-compute-increase-quota?id=kb_article_view&sysparm_article=KB0050836',
  AU:
    'https://help.ovhcloud.com/csm/en-au-public-cloud-compute-increase-quota?id=kb_article_view&sysparm_article=KB0050838',
  CA:
    'https://help.ovhcloud.com/csm/en-ca-public-cloud-compute-increase-quota?id=kb_article_view&sysparm_article=KB0050852',
  SG:
    'https://help.ovhcloud.com/csm/en-sg-public-cloud-compute-increase-quota?id=kb_article_view&sysparm_article=KB0050844',
  WE:
    'https://help.ovhcloud.com/csm/en-public-cloud-compute-increase-quota?id=kb_article_view&sysparm_article=KB0050845',
  IN:
    'https://help.ovhcloud.com/csm/asia-public-cloud-compute-increase-quota?id=kb_article_view&sysparm_article=KB0050836',
  FR:
    'https://help.ovhcloud.com/csm/fr-public-cloud-compute-increase-quota?id=kb_article_view&sysparm_article=KB0050857',
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

// Dashboard Tile Types and Constants
export type DashboardItem = {
  label?: string;
  labelTranslationKey?: string;
  description?: string;
  descriptionTranslationKey?: string;
  link?: string;
  linkLabelTranslationKey?: string;
  iconODS?: ODS_ICON_NAME;
  iconImage?: string;
  target?: string;
  rel?: string;
  color?: string;
  ariaLabelTranslationKey?: string;
  price?: string;
  validUntil?: string | null;
  hideTileIfNoOtherItems?: boolean;
};

// Config type for items that need transformation before becoming DashboardItem
export type DashboardItemConfig = DashboardItem & {
  documentationGuideKey?: string;
};

export type DashboardTile = {
  titleTranslationKey: string;
  // Tile type. Defaults to 'standard' if not specified.
  type?: 'standard' | 'billing';
  items: DashboardItem[];
};

export const DOC_BASE_URL = 'https://help.ovhcloud.com/csm';
export const DOC_PUBLIC_CLOUD_PATH = '/public-cloud';

// Typed list of supported subsidiary codes
export const SUPPORTED_SUBSIDIARIES = [
  'FR',
  'GB',
  'DE',
  'ES',
  'CA',
  'QC',
  'DEFAULT',
  'ASIA',
  'AU',
  'IE',
  'IT',
  'MA',
  'NL',
  'PL',
  'PT',
  'SG',
  'SN',
  'TN',
  'WE',
  'WS',
  'IN',
] as const;

// Utility function to create subsidiary objects with proper typing
export const createSubsidiaryObject = <T>(
  generator: (subsidiary: OvhSubsidiary) => T,
): Partial<{ [key in OvhSubsidiary]: T }> => {
  const result: Partial<{ [key in OvhSubsidiary]: T }> = {};
  SUPPORTED_SUBSIDIARIES.forEach((subsidiary) => {
    result[subsidiary as OvhSubsidiary] = generator(
      subsidiary as OvhSubsidiary,
    );
  });
  return result;
};

/**
 * Utility function to ensure all supported subsidiaries have a value with fallback to DEFAULT
 *
 * This function guarantees that:
 * 1. All codes in SUPPORTED_SUBSIDIARIES have a value in the mapping
 * 2. If a subsidiary is not explicitly defined, it falls back to DEFAULT
 * 3. If DEFAULT is not defined, it uses the provided defaultValue
 *
 * This prevents runtime errors when accessing subsidiary-specific values
 * and ensures consistent fallback behavior across all URL generation functions.
 */
export const ensureCompleteSubsidiaryMapping = <T>(
  mapping: Partial<{ [key in OvhSubsidiary]: T }>,
  defaultValue: T,
): Partial<{ [key in OvhSubsidiary]: T }> => {
  const result: Partial<{ [key in OvhSubsidiary]: T }> = { ...mapping };

  // Ensure DEFAULT exists
  if (!result.DEFAULT) {
    result.DEFAULT = defaultValue;
  }

  // Ensure all supported subsidiaries have a value (fallback to DEFAULT)
  SUPPORTED_SUBSIDIARIES.forEach((subsidiary) => {
    if (!result[subsidiary as OvhSubsidiary]) {
      result[subsidiary as OvhSubsidiary] = result.DEFAULT || defaultValue;
    }
  });

  return result;
};

// Unified language mappings for all URL patterns
export const LANGUAGE_MAPPINGS: Partial<
  { [key in OvhSubsidiary]: string }
> = ensureCompleteSubsidiaryMapping(
  {
    DEFAULT: 'en',
    ASIA: 'asia',
    AU: 'en-au',
    CA: 'en-ca',
    DE: 'de',
    ES: 'es-es',
    FR: 'fr',
    GB: 'en-gb',
    IE: 'en-ie',
    IT: 'it',
    MA: 'fr-ma',
    NL: 'nl',
    PL: 'pl',
    PT: 'pt',
    QC: 'fr-ca',
    SG: 'en-sg',
    SN: 'fr-sn',
    TN: 'fr-tn',
    WE: 'en',
    WS: 'es',
    IN: 'asia',
  },
  'en',
);

// URL construction utilities
export const buildDocumentationUrl = (
  basePath: string,
  subsidiary: OvhSubsidiary,
  articleId: string,
): string => {
  const language = LANGUAGE_MAPPINGS[subsidiary] || LANGUAGE_MAPPINGS.DEFAULT;
  return `${DOC_BASE_URL}${basePath}/${language}-public-cloud-compute-${articleId}?id=kb_article_view&sysparm_article=${articleId}`;
};

// Generic function to build URLs with different patterns
export const buildOvhCloudUrl = (
  subsidiary: OvhSubsidiary,
  path: string,
): string => {
  const language = LANGUAGE_MAPPINGS[subsidiary] || LANGUAGE_MAPPINGS.DEFAULT;
  return `https://www.ovhcloud.com/${language}/${path}`;
};

export const buildDeveloperCenterUrl = (subsidiary: OvhSubsidiary): string => {
  return buildOvhCloudUrl(subsidiary, 'developer-center/');
};

export const buildHdsUrl = (subsidiary: OvhSubsidiary): string => {
  return buildOvhCloudUrl(
    subsidiary,
    'enterprise/certification-conformity/hds/',
  );
};

// Refactored HDS_INFO using the centralized function and typed list
export const HDS_INFO_REFACTORED: Partial<
  { [key in OvhSubsidiary]: string }
> = createSubsidiaryObject(buildHdsUrl);

// Specific function for documentation guide URLs
export const buildGuideUrl = (
  subsidiary: OvhSubsidiary,
  articleId: string,
): string => {
  const language = LANGUAGE_MAPPINGS[subsidiary] || LANGUAGE_MAPPINGS.DEFAULT;
  return `${DOC_PUBLIC_CLOUD_PATH}/${language}-public-cloud-compute-${articleId}?id=kb_article_view&sysparm_article=${articleId}`;
};

// Function to generate documentation guide links for all subsidiaries
export const generateGuideLinks = (articleId: string): Partial<GuideLinks> => {
  const links: Partial<GuideLinks> = {};

  // Generate links for all supported subsidiaries
  SUPPORTED_SUBSIDIARIES.forEach((subsidiary) => {
    const language = LANGUAGE_MAPPINGS[subsidiary];
    if (language && subsidiary !== 'DEFAULT') {
      links[
        subsidiary as CountryCode
      ] = `${DOC_PUBLIC_CLOUD_PATH}/${language}-public-cloud-compute-${articleId}?id=kb_article_view&sysparm_article=${articleId}`;
    }
  });

  // Add DEFAULT fallback
  links.DEFAULT = `${DOC_PUBLIC_CLOUD_PATH}/${LANGUAGE_MAPPINGS.DEFAULT}-public-cloud-compute-${articleId}?id=kb_article_view&sysparm_article=${articleId}`;

  return links;
};

// Quota limit guide article IDs by subsidiary
export const QUOTA_LIMIT_ARTICLE_IDS: Partial<
  { [key in OvhSubsidiary]: string }
> = ensureCompleteSubsidiaryMapping(
  {
    // Countries with specific article IDs
    GB: 'KB0050843',
    IE: 'KB0050840',
    ASIA: 'KB0050836',
    AU: 'KB0050838',
    CA: 'KB0050852',
    SG: 'KB0050844',
    WE: 'KB0050845',
    IN: 'KB0050836',
    FR: 'KB0050857',

    // Countries that fallback to DEFAULT (using GB article ID)
    DE: 'KB0050843',
    ES: 'KB0050843',
    IT: 'KB0050843',
    MA: 'KB0050843',
    NL: 'KB0050843',
    PL: 'KB0050843',
    PT: 'KB0050843',
    QC: 'KB0050843',
    SN: 'KB0050843',
    TN: 'KB0050843',
    WS: 'KB0050843',

    DEFAULT: 'KB0050843',
  },
  'KB0050843',
);

// Function to generate quota limit guide URLs
export const generateQuotaLimitGuideUrl = (
  subsidiary: OvhSubsidiary,
): string => {
  const articleId =
    QUOTA_LIMIT_ARTICLE_IDS[subsidiary] || QUOTA_LIMIT_ARTICLE_IDS.DEFAULT;

  // Special cases for subsidiaries with different URL patterns
  if (subsidiary === 'ASIA' || subsidiary === 'IN') {
    return `${DOC_BASE_URL}/asia-public-cloud-compute-increase-quota?id=kb_article_view&sysparm_article=${articleId}`;
  }

  if (subsidiary === 'WE') {
    return `${DOC_BASE_URL}/en-public-cloud-compute-increase-quota?id=kb_article_view&sysparm_article=${articleId}`;
  }

  // Standard pattern for other subsidiaries
  // For quota guides, DEFAULT should use 'en-gb' not 'en'
  let language = LANGUAGE_MAPPINGS[subsidiary] || LANGUAGE_MAPPINGS.DEFAULT;
  if (subsidiary === 'DEFAULT') {
    language = 'en-gb';
  }
  return `${DOC_BASE_URL}/${language}-public-cloud-compute-increase-quota?id=kb_article_view&sysparm_article=${articleId}`;
};

// Refactored QUOTA_LIMIT_GUIDES using the centralized function and typed list
export const QUOTA_LIMIT_GUIDES_REFACTORED: Partial<
  { [key in OvhSubsidiary]: string }
> = createSubsidiaryObject(generateQuotaLimitGuideUrl);

type GuideLinks = { [key in CountryCode | 'DEFAULT']: string };

// Documentation guide article IDs
export const DOCUMENTATION_ARTICLE_IDS = {
  getting_started: 'essential-information',
  public_cloud: 'control-panel',
  instances: 'getting-started-instance',
  billing: 'billing-options',
  guides: 'home',
} as const;

// Special case for guides (different URL pattern)
export const generateGuidesLinks = (): Partial<GuideLinks> => {
  const links: Partial<GuideLinks> = {};

  Object.entries(LANGUAGE_MAPPINGS).forEach(([subsidiary, language]) => {
    if (subsidiary !== 'DEFAULT') {
      links[
        subsidiary as CountryCode
      ] = `${DOC_PUBLIC_CLOUD_PATH}/${language}-home?id=csm_index`;
    }
  });

  links.DEFAULT = `${DOC_PUBLIC_CLOUD_PATH}/${LANGUAGE_MAPPINGS.DEFAULT}-home?id=csm_index`;

  return links;
};

export const DOCUMENTATION_GUIDE_LINKS: {
  [guideName: string]: Partial<GuideLinks>;
} = {
  getting_started: generateGuideLinks('essential-information'),
  public_cloud: generateGuideLinks('control-panel'),
  instances: generateGuideLinks('getting-started-instance'),
  billing: generateGuideLinks('billing-options'),
  guides: generateGuidesLinks(),
};

export const DASHBOARD_DOCUMENTATION_LINKS_CONFIG: DashboardItemConfig[] = [
  {
    labelTranslationKey: 'pci_projects_project_getting_started',
    linkLabelTranslationKey: 'pci_projects_project_essential_to_start',
    documentationGuideKey: 'getting_started',
  },
  {
    labelTranslationKey: 'pci_projects_project_public_cloud',
    linkLabelTranslationKey: 'pci_projects_project_get_familiar',
    documentationGuideKey: 'public_cloud',
  },
  {
    labelTranslationKey: 'pci_projects_project_instances',
    linkLabelTranslationKey: 'pci_projects_project_manage_instances',
    documentationGuideKey: 'instances',
  },
  {
    labelTranslationKey: 'pci_projects_project_billing',
    linkLabelTranslationKey: 'pci_projects_project_understand_manage',
    documentationGuideKey: 'billing',
  },
  {
    labelTranslationKey: 'pci_projects_project_guides',
    linkLabelTranslationKey: 'pci_projects_project_see_all_guides',
    documentationGuideKey: 'guides',
  },
];

// Developer Center URL construction (now uses centralized LANGUAGE_MAPPINGS)

export const DASHBOARD_COMMUNITY_LINKS: DashboardItem[] = [
  {
    labelTranslationKey: 'pci_projects_project_roadmap',
    linkLabelTranslationKey: 'pci_projects_project_discover_participate',
    link: ROADMAP_CHANGELOG_LINKS.roadmap,
  },
  {
    labelTranslationKey: 'pci_projects_project_developer_center',
    linkLabelTranslationKey: 'pci_projects_project_start_with_products',
    // LINK is dynamically constructed based on subsidiary in useDashboardSections hook
  },
  {
    labelTranslationKey: 'pci_projects_project_community',
  },
  {
    labelTranslationKey: '',
    linkLabelTranslationKey: 'pci_projects_project_discuss_discord',
    link: 'https://discord.gg/ovhcloud',
  },
  {
    labelTranslationKey: '',
    linkLabelTranslationKey: 'pci_projects_project_discuss_community',
    link: 'https://community.ovh.com/',
  },
];

export const DASHBOARD_CREDIT_VOUCHER_LINK: DashboardItem = {
  linkLabelTranslationKey: 'pci_projects_project_credits_vouchers',
  link: '/vouchers',
  color: 'primary',
  iconODS: ODS_ICON_NAME.arrowRight,
  ariaLabelTranslationKey: 'pci_projects_project_link_credits_vouchers_aria',
  hideTileIfNoOtherItems: true,
};

// Quick Access Items - Base configuration without iconImage (will be added in component)
export const DASHBOARD_QUICK_ACCESS_ITEMS_BASE: DashboardItem[] = [
  {
    labelTranslationKey: 'pci_projects_project_instances',
    descriptionTranslationKey: 'pci_projects_project_create_instance',
    link: `instances/new`,
  },
  {
    labelTranslationKey: 'pci_projects_project_kubernetes',
    descriptionTranslationKey: 'pci_projects_project_create_cluster',
    link: PCI_FEATURES_STATES.KUBERNETES.LIST.url,
  },
  {
    labelTranslationKey: 'pci_projects_project_object_storage',
    descriptionTranslationKey: 'pci_projects_project_create_container',
    link: PCI_FEATURES_STATES.OBJECTS.LIST.url,
  },
  {
    labelTranslationKey: 'pci_projects_project_block_storage',
    descriptionTranslationKey: 'pci_projects_project_create_volume',
    link: PCI_FEATURES_STATES.BLOCKS.LIST.url,
  },
  {
    labelTranslationKey: 'pci_projects_project_network',
    descriptionTranslationKey: 'pci_projects_project_manage_vrack',
    link: PCI_FEATURES_STATES.PRIVATE_NETWORK.LIST.url,
  },
  {
    labelTranslationKey: 'pci_projects_project_database',
    descriptionTranslationKey: 'pci_projects_project_create_database',
    link: PCI_FEATURES_STATES.DATABASES.ADD.url,
  },
];

export const DASHBOARD_OTHER_ACTIONS_ITEMS: DashboardItem[] = [
  {
    iconODS: ODS_ICON_NAME.book,
    labelTranslationKey: 'pci_projects_project_create_ai_notebook',
    link: PCI_FEATURES_STATES.NOTEBOOKS.ADD.url,
  },
  {
    iconODS: ODS_ICON_NAME.network,
    labelTranslationKey: 'pci_projects_project_create_load_balancer',
    link: PCI_FEATURES_STATES.LOADBALANCER.LIST.url,
  },
  {
    iconODS: ODS_ICON_NAME.bill,
    labelTranslationKey: 'pci_projects_project_billing',
    link: PCI_FEATURES_STATES.PROJECT_MANAGEMENT.BILLING_CONTROL.url,
  },
  {
    iconODS: ODS_ICON_NAME.cog,
    labelTranslationKey: 'pci_projects_project_quotas',
    link: PCI_FEATURES_STATES.PROJECT_MANAGEMENT.QUOTA_AND_REGIONS.url,
  },
];
