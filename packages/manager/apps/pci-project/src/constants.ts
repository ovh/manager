import { OvhSubsidiary } from '@ovh-ux/manager-react-components';
import { CountryCode } from '@ovh-ux/manager-config';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';

export const QUOTA_THRESHOLD = 80;

export const ROADMAP_CHANGELOG_LINKS = {
  changelog: 'https://github.com/orgs/ovh/projects/16/views/6?pane=info',
  roadmap: 'https://github.com/orgs/ovh/projects/16/views/1?pane=info',
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
  labelTranslationKey?: string;
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
  type: 'billing' | 'documentation' | 'community';
  items: DashboardItem[];
};

export const DOC_BASE_URL = 'https://docs.ovh.com';
export const DOC_PUBLIC_CLOUD_PATH = '/public-cloud';

type GuideLinks = { [key in CountryCode | 'DEFAULT']: string };

export const DOCUMENTATION_GUIDE_LINKS: {
  [guideName: string]: Partial<GuideLinks>;
} = {
  getting_started: {
    DEFAULT: `${DOC_PUBLIC_CLOUD_PATH}/premiers-pas-instance-public-cloud/`,
    DE: `/de${DOC_PUBLIC_CLOUD_PATH}/premiers-pas-instance-public-cloud/`,
    ES: `/es${DOC_PUBLIC_CLOUD_PATH}/premiers-pas-instance-public-cloud/`,
    FR: `/fr${DOC_PUBLIC_CLOUD_PATH}/premiers-pas-instance-public-cloud/`,
    GB: `/gb${DOC_PUBLIC_CLOUD_PATH}/premiers-pas-instance-public-cloud/`,
    CA: `/ca/fr${DOC_PUBLIC_CLOUD_PATH}/premiers-pas-instance-public-cloud/`,
    QC: `/ca/fr${DOC_PUBLIC_CLOUD_PATH}/premiers-pas-instance-public-cloud/`,
    US: `/us${DOC_PUBLIC_CLOUD_PATH}/premiers-pas-instance-public-cloud/`,
  },
  public_cloud: {
    DEFAULT: `${DOC_PUBLIC_CLOUD_PATH}/`,
    DE: `/de${DOC_PUBLIC_CLOUD_PATH}/`,
    ES: `/es${DOC_PUBLIC_CLOUD_PATH}/`,
    FR: `/fr${DOC_PUBLIC_CLOUD_PATH}/`,
    GB: `/gb${DOC_PUBLIC_CLOUD_PATH}/`,
    CA: `/ca/fr${DOC_PUBLIC_CLOUD_PATH}/`,
    QC: `/ca/fr${DOC_PUBLIC_CLOUD_PATH}/`,
    US: `/us${DOC_PUBLIC_CLOUD_PATH}/`,
  },
  instances: {
    DEFAULT: `${DOC_PUBLIC_CLOUD_PATH}/creer-instance-espace-client/`,
    DE: `/de${DOC_PUBLIC_CLOUD_PATH}/creer-instance-espace-client/`,
    ES: `/es${DOC_PUBLIC_CLOUD_PATH}/creer-instance-espace-client/`,
    FR: `/fr${DOC_PUBLIC_CLOUD_PATH}/creer-instance-espace-client/`,
    GB: `/gb${DOC_PUBLIC_CLOUD_PATH}/creer-instance-espace-client/`,
    CA: `/ca/fr${DOC_PUBLIC_CLOUD_PATH}/creer-instance-espace-client/`,
    QC: `/ca/fr${DOC_PUBLIC_CLOUD_PATH}/creer-instance-espace-client/`,
    US: `/us${DOC_PUBLIC_CLOUD_PATH}/creer-instance-espace-client/`,
  },
  billing: {
    DEFAULT: `${DOC_PUBLIC_CLOUD_PATH}/comprendre-facturation-cloud/`,
    DE: `/de${DOC_PUBLIC_CLOUD_PATH}/comprendre-facturation-cloud/`,
    ES: `/es${DOC_PUBLIC_CLOUD_PATH}/comprendre-facturation-cloud/`,
    FR: `/fr${DOC_PUBLIC_CLOUD_PATH}/comprendre-facturation-cloud/`,
    GB: `/gb${DOC_PUBLIC_CLOUD_PATH}/comprendre-facturation-cloud/`,
    CA: `/ca/fr${DOC_PUBLIC_CLOUD_PATH}/comprendre-facturation-cloud/`,
    QC: `/ca/fr${DOC_PUBLIC_CLOUD_PATH}/comprendre-facturation-cloud/`,
    US: `/us${DOC_PUBLIC_CLOUD_PATH}/comprendre-facturation-cloud/`,
  },
  guides: {
    DEFAULT: `${DOC_PUBLIC_CLOUD_PATH}/`,
    DE: `/de${DOC_PUBLIC_CLOUD_PATH}/`,
    ES: `/es${DOC_PUBLIC_CLOUD_PATH}/`,
    FR: `/fr${DOC_PUBLIC_CLOUD_PATH}/`,
    GB: `/gb${DOC_PUBLIC_CLOUD_PATH}/`,
    CA: `/ca/fr${DOC_PUBLIC_CLOUD_PATH}/`,
    QC: `/ca/fr${DOC_PUBLIC_CLOUD_PATH}/`,
    US: `/us${DOC_PUBLIC_CLOUD_PATH}/`,
  },
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

export const DASHBOARD_COMMUNITY_LINKS: DashboardItem[] = [
  {
    labelTranslationKey: 'pci_projects_project_roadmap',
    linkLabelTranslationKey: 'pci_projects_project_discover_participate',
    link: ROADMAP_CHANGELOG_LINKS.roadmap,
  },
  {
    labelTranslationKey: 'pci_projects_project_developer_center',
    linkLabelTranslationKey: 'pci_projects_project_start_with_products',
    link: 'https://developer.ovh.com/',
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
    link: `kubernetes/new`,
  },
  {
    labelTranslationKey: 'pci_projects_project_object_storage',
    descriptionTranslationKey: 'pci_projects_project_create_container',
    link: `storages/objects/new`,
  },
  {
    labelTranslationKey: 'pci_projects_project_block_storage',
    descriptionTranslationKey: 'pci_projects_project_create_volume',
    link: `storages/blocks`,
  },
  {
    labelTranslationKey: 'pci_projects_project_network',
    descriptionTranslationKey: 'pci_projects_project_manage_vrack',
    link: `private-networks`,
  },
  {
    labelTranslationKey: 'pci_projects_project_database',
    descriptionTranslationKey: 'pci_projects_project_create_database',
    link: `databases-analytics/operational/services/new`,
  },
];
