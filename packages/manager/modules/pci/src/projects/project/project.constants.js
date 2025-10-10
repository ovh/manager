import { PCI_FEATURES as IMPORT_PCI_FEATURES } from '../projects.constant';

import ASSET_INSTANCES from './assets/instances.png';
import ASSET_DATABASES from './assets/databases.png';
import ASSET_KUBERNETES from './assets/kubernetes.png';
import ASSET_AINOTEBOOK from './assets/ainotebook.png';
import ASSET_OBJECTSTORAGE from './assets/objectstorage.png';
import ASSET_BLOCKSTORAGE from './assets/blockstorage.png';
import ASSET_IPFAILOVER from './assets/ipfailover.png';
import ASSET_PRIVATENETWORK from './assets/privatenetwork.png';
import ASSET_DATAPLATFORM from './assets/dataplatform.png';

export const PCI_FEATURES = IMPORT_PCI_FEATURES;

export const DEFAULT_CIDR = 16;

export const DEFAULT_IP = '10.{vlanId}.0.0';

export const DEFAULT_VLAN_ID = 1;

export const NETWORK_ACTIVE_STATUS = 'ACTIVE';

export const PLAN_ORDER = ['.s.', '.m.', '.l.', '.xl.', '.2xl.', '.3xl.'];

export const VLAN_ID = {
  MIN: 0,
  MAX: 4000,
};

export const PRODUCT_IMAGES = {
  instances: ASSET_INSTANCES,
  databases: ASSET_DATABASES,
  kubernetes: ASSET_KUBERNETES,
  ainotebook: ASSET_AINOTEBOOK,
  objectstorage: ASSET_OBJECTSTORAGE,
  blockstorage: ASSET_BLOCKSTORAGE,
  ipfailover: ASSET_IPFAILOVER,
  privatenetwork: ASSET_PRIVATENETWORK,
  dataplatform: ASSET_DATAPLATFORM,
};

export const ACTIONS = [
  {
    translation: 'pci_projects_project_create_an_instance',
    state: 'pci.projects.project.instances.add',
    feature: PCI_FEATURES.PRODUCTS.INSTANCE,
    name: 'instances',
  },
  {
    translation: 'pci_projects_project_create_cluster_kubernetes',
    state: 'pci.projects.project.kubernetes',
    feature: PCI_FEATURES.PRODUCTS.KUBERNETES,
    name: 'kubernetes',
  },
  {
    translation: 'pci_projects_project_create_a_container',
    state: 'pci.projects.project.storages.object-storage.add',
    feature: PCI_FEATURES.PRODUCTS.OBJECT_STORAGE,
    name: 'objectstorage',
  },
  {
    translation: 'pci_projects_project_create_a_volume',
    state: 'pci.projects.project.storages.blocks.add',
    feature: PCI_FEATURES.PRODUCTS.BLOCK_STORAGE,
    name: 'blockstorage',
  },
  {
    translation: 'pci_projects_project_activate_private_networks',
    state: 'pci.projects.project.privateNetwork',
    feature: PCI_FEATURES.PRODUCTS.PRIVATE_NETWORK,
    name: 'privatenetwork',
  },
  {
    translation: 'pci_projects_project_buy_ip_failover',
    state: 'pci.projects.project.failover-ips',
    feature: PCI_FEATURES.PRODUCTS.FAILOVER_IP,
    name: 'ipfailover',
  },
];

export const DATABASE_UAPP_CONFIG = {
  universe: 'public-cloud',
  url:
    '#/pci/projects/{projectId}/databases-analytics/operational/services/new',
  translation: 'pci_projects_project_create_cluster_database',
  feature: PCI_FEATURES.PRODUCTS.DATABASES_ANALYTICS,
  name: 'databases',
};

export const DATA_PLATFORM_CONFIG = {
  universe: 'public-cloud',
  url: '#/pci/projects/{projectId}/dataplatform',
  translation: 'pci_projects_project_data_platform',
  feature: PCI_FEATURES.PRODUCTS.DATA_PLATFORM,
  name: 'dataplatform',
};

export const NOTEBOOKS_UAPP_CONFIG = {
  universe: 'public-cloud',
  url: '#/pci/projects/{projectId}/ai-ml/notebooks',
  translation: 'pci_projects_project_create_ai_notebook',
  feature: PCI_FEATURES.PRODUCTS.NOTEBOOKS,
  name: 'ainotebook',
};

const PROJECT_PAGE_TRACKING_NAME = 'PublicCloud::pci::projects::project';

export const DOCUMENTATION_LINKS = [
  {
    term: 'pci_projects_project_documentation_getting_started_term',
    description:
      'pci_projects_project_documentation_getting_started_description',
    href:
      'https://docs.ovh.com/gb/en/public-cloud/public-cloud-essential-information/',
    feature: PCI_FEATURES.LINKS.CLOUD_ESSENTIAL_INFORMATION,
    trackingName: `${PROJECT_PAGE_TRACKING_NAME}::docs-pci-basics`,
  },
  {
    term: 'pci_projects_project_documentation_interface_term',
    description: 'pci_projects_project_documentation_interface_description',
    href: 'https://docs.ovh.com/gb/en/public-cloud/public-cloud-interface/',
    feature: PCI_FEATURES.LINKS.PUBLIC_CLOUD_INTERFACE,
    trackingName: `${PROJECT_PAGE_TRACKING_NAME}::docs-pci-interface`,
  },
  {
    term: 'pci_projects_project_documentation_instances_term',
    description: 'pci_projects_project_documentation_instances_description',
    href:
      'https://docs.ovh.com/gb/en/public-cloud/get-started-with-a-public-cloud-instance/',
    feature: PCI_FEATURES.LINKS.START_PCI_INSTANCE,
    trackingName: `${PROJECT_PAGE_TRACKING_NAME}::docs-get-started-with-instances`,
  },
  {
    term: 'pci_projects_project_documentation_billing_term',
    description: 'pci_projects_project_documentation_billing_description',
    href:
      'https://docs.ovh.com/gb/en/public-cloud/information-on-cloud-billing-options/',
    feature: PCI_FEATURES.LINKS.CLOUD_BILLING_OPTIONS,
    trackingName: `${PROJECT_PAGE_TRACKING_NAME}::docs-billing`,
  },
  {
    term: 'pci_projects_project_documentation_guides_term',
    description: 'pci_projects_project_documentation_guides_description',
    href: 'https://docs.ovh.com/gb/en/',
    feature: PCI_FEATURES.LINKS.ALL_GUIDES,
    trackingName: `${PROJECT_PAGE_TRACKING_NAME}::docs-all-guides`,
  },
  {
    term: 'pci_projects_project_documentation_block_storage_term',
    description: 'pci_projects_project_documentation_block_storage_description',
    href: 'https://support.us.ovhcloud.com/hc/en-us/articles/360002157044',
    feature: PCI_FEATURES.LINKS.START_WITH_BLOCK_STORAGE,
    trackingName: `${PROJECT_PAGE_TRACKING_NAME}::docs_start_with_block_storage`,
  },
];

export const COMMUNITY_LINKS = [
  {
    term: 'pci_projects_project_community_roadmap_term',
    description: 'pci_projects_project_community_roadmap_description',
    href: 'https://github.com/ovh/public-cloud-roadmap/projects',
    regions: ['EU', 'CA'],
    trackingName: `${PROJECT_PAGE_TRACKING_NAME}::community-roadmap`,
  },
  {
    term: 'pci_projects_project_community_discord_term',
    description: 'pci_projects_project_community_discord_description',
    href: 'https://discord.gg/ovhcloud',
    regions: ['EU', 'CA'],
    trackingName: `${PROJECT_PAGE_TRACKING_NAME}::community-discord`,
  },
];
export const API_GUIDES = {
  DEFAULT: 'https://docs.ovh.com/gb/en/api/first-steps-with-ovh-api/',
  ASIA: 'https://docs.ovh.com/asia/en/api/first-steps-with-ovh-api/',
  AU: 'https://docs.ovh.com/au/en/api/first-steps-with-ovh-api/',
  CA: 'https://docs.ovh.com/ca/en/api/first-steps-with-ovh-api/',
  FR: 'https://docs.ovh.com/fr/api/api-premiers-pas/',
  GB: 'https://docs.ovh.com/gb/en/api/first-steps-with-ovh-api/',
  IE: 'https://docs.ovh.com/ie/en/api/first-steps-with-ovh-api/',
  QC: 'https://docs.ovh.com/ca/fr/api/api-premiers-pas/',
  SG: 'https://docs.ovh.com/sg/en/api/first-steps-with-ovh-api/',
};

export const TERRAFORM_GUIDES = {
  DEFAULT: 'https://docs.ovh.com/gb/en/publiccloud/databases/order-terraform/',
  ASIA: 'https://docs.ovh.com/asia/en/publiccloud/databases/order-terraform/',
  AU: 'https://docs.ovh.com/au/en/publiccloud/databases/order-terraform/',
  CA: 'https://docs.ovh.com/ca/en/publiccloud/databases/order-terraform/',
  FR: 'https://docs.ovh.com/fr/publiccloud/databases/order-terraform/',
  GB: 'https://docs.ovh.com/gb/en/publiccloud/databases/order-terraform/',
  IE: 'https://docs.ovh.com/ie/en/publiccloud/databases/order-terraform/',
  QC: 'https://docs.ovh.com/ca/fr/publiccloud/databases/order-terraform/',
  SG: 'https://docs.ovh.com/sg/en/publiccloud/databases/order-terraform/',
};
/**
 *
 * @type {Partial<Record<import('manager-react-components').OvhSubsidiary | 'DEFAULT', string>>}
 */
export const QUOTA_LIMIT_GUIDES = {
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

export const DISCOVERY_PROMOTION_VOUCHER = 'FREETRIAL';

export const DATABASE_CREATION_GUIDES =
  'https://github.com/ovh/public-cloud-databases-examples';

export const PCI_HDS_ADDON = {
  productName: 'cloud',
  family: 'certification-hds',
  parentPlanCode: 'project.2018',
  planCodeScope: 'certification.hds',
  certifiedProject: 'publiccloud-certification-hds',
  planCode: 'certification.hds.2018',
};

export const PCI_HDS_DISCOVERY_ADDON = {
  productName: 'cloud',
  family: 'certification-hds',
  parentPlanCode: 'project.discovery',
  planCodeScope: 'certification.hds',
  certifiedProject: 'publiccloud-certification-hds',
  planCode: 'certification.hds.2018',
};

export const LEGACY_PLAN_CODES = ['project.legacy', 'project.2018'];

export const LOCAL_ZONE_REGION = 'localzone';

export const ONE_AZ_REGION = 'region';

export const THREE_AZ_REGION = 'region-3-az';
export const HOURS_PER_MONTH = 730;

export const LOCAL_ZONE_INFO_URL = {
  DEFAULT: 'https://ovhcloud.com/en/public-cloud/local-zone-compute/',
  ASIA: 'https://ovhcloud.com/asia/public-cloud/local-zone-compute/',
  DE: 'https://ovhcloud.com/de/public-cloud/local-zone-compute/',
  ES: 'https://www.ovhcloud.com/es-es/public-cloud/local-zone-compute/',
  IE: 'https://ovhcloud.com/en-ie/public-cloud/local-zone-compute/',
  IT: 'https://ovhcloud.com/it/public-cloud/local-zone-compute/',
  NL: 'https://ovhcloud.com/nl/public-cloud/local-zone-compute/',
  PL: 'https://ovhcloud.com/pl/public-cloud/local-zone-compute/',
  PT: 'https://ovhcloud.com/pt/public-cloud/local-zone-compute/',
  GB: 'https://ovhcloud.com/en-gb/public-cloud/local-zone-compute/',
  CA: 'https://ovhcloud.com/en-ca/public-cloud/local-zone-compute/',
  QC: 'https://ovhcloud.com/fr-ca/public-cloud/local-zone-compute/',
  MA: 'https://ovhcloud.com/fr-ma/public-cloud/local-zone-compute/',
  SN: 'https://ovhcloud.com/fr-sn/public-cloud/local-zone-compute/',
  TN: 'https://ovhcloud.com/fr-tn/public-cloud/local-zone-compute/',
  AU: 'https://ovhcloud.com/en-au/public-cloud/local-zone-compute/',
  SG: 'https://ovhcloud.com/en-sg/public-cloud/local-zone-compute/',
  FR: 'https://ovhcloud.com/fr/public-cloud/local-zone-compute/',
  WE: 'https://ovhcloud.com/us-en/public-cloud/local-zone-compute/',
  WS: 'https://ovhcloud.com/us-en/public-cloud/local-zone-compute/',
  US: 'https://us.ovhcloud.com/public-cloud/local-zone-compute/',
};

export const REGIONS_3AZ_URL = {
  DEFAULT:
    'https://www.ovhcloud.com/en/about-us/global-infrastructure/expansion-regions-az/',
  ASIA:
    'https://www.ovhcloud.com/asia/about-us/global-infrastructure/expansion-regions-az/',
  DE:
    'https://www.ovhcloud.com/de/about-us/global-infrastructure/expansion-regions-az/',
  ES:
    'https://www.ovhcloud.com/es/about-us/global-infrastructure/expansion-regions-az/',
  IE:
    'https://www.ovhcloud.com/en-ie/about-us/global-infrastructure/expansion-regions-az/',
  IT:
    'https://www.ovhcloud.com/it/about-us/global-infrastructure/expansion-regions-az/',
  NL:
    'https://www.ovhcloud.com/nl/about-us/global-infrastructure/expansion-regions-az/',
  PL:
    'https://www.ovhcloud.com/pl/about-us/global-infrastructure/expansion-regions-az/',
  PT:
    'https://www.ovhcloud.com/pt/about-us/global-infrastructure/expansion-regions-az/',
  GB:
    'https://www.ovhcloud.com/en-gb/about-us/global-infrastructure/expansion-regions-az/',
  CA:
    'https://www.ovhcloud.com/en-ca/about-us/global-infrastructure/expansion-regions-az/',
  QC:
    'https://www.ovhcloud.com/fr-ca/about-us/global-infrastructure/expansion-regions-az/',
  MA:
    'https://www.ovhcloud.com/fr-ma/about-us/global-infrastructure/expansion-regions-az/',
  SN:
    'https://www.ovhcloud.com/fr-sn/about-us/global-infrastructure/expansion-regions-az/',
  TN:
    'https://www.ovhcloud.com/fr-tn/about-us/global-infrastructure/expansion-regions-az/',
  AU:
    'https://www.ovhcloud.com/en-au/about-us/global-infrastructure/expansion-regions-az/',
  SG:
    'https://www.ovhcloud.com/en-sg/about-us/global-infrastructure/expansion-regions-az/',
  FR:
    'https://www.ovhcloud.com/fr/about-us/global-infrastructure/expansion-regions-az/',
  WS:
    'https://www.ovhcloud.com/en/about-us/global-infrastructure/expansion-regions-az/',
  US:
    'https://www.ovhcloud.com/en/about-us/global-infrastructure/expansion-regions-az/',
  WE:
    'https://www.ovhcloud.com/en/about-us/global-infrastructure/expansion-regions-az/',
};

export const GLOBAL_REGIONS_INFO_URL = {
  DEFAULT:
    'https://www.ovhcloud.com/en/about-us/global-infrastructure/expansion-regions-az/',
  ASIA:
    'https://www.ovhcloud.com/asia/about-us/global-infrastructure/expansion-regions-az/',
  DE:
    'https://www.ovhcloud.com/de/about-us/global-infrastructure/expansion-regions-az/',
  ES:
    'https://www.ovhcloud.com/es/about-us/global-infrastructure/expansion-regions-az/',
  IE:
    'https://www.ovhcloud.com/en-ie/about-us/global-infrastructure/expansion-regions-az/',
  IT:
    'https://www.ovhcloud.com/it/about-us/global-infrastructure/expansion-regions-az/',
  NL:
    'https://www.ovhcloud.com/nl/about-us/global-infrastructure/expansion-regions-az/',
  PL:
    'https://www.ovhcloud.com/pl/about-us/global-infrastructure/expansion-regions-az/',
  PT:
    'https://www.ovhcloud.com/pt/about-us/global-infrastructure/expansion-regions-az/',
  GB:
    'https://www.ovhcloud.com/en-gb/about-us/global-infrastructure/expansion-regions-az/',
  CA:
    'https://www.ovhcloud.com/en-ca/about-us/global-infrastructure/expansion-regions-az/',
  QC:
    'https://www.ovhcloud.com/fr-ca/about-us/global-infrastructure/expansion-regions-az/',
  MA:
    'https://www.ovhcloud.com/fr-ma/about-us/global-infrastructure/expansion-regions-az/',
  SN:
    'https://www.ovhcloud.com/fr-sn/about-us/global-infrastructure/expansion-regions-az/',
  TN:
    'https://www.ovhcloud.com/fr-tn/about-us/global-infrastructure/expansion-regions-az/',
  AU:
    'https://www.ovhcloud.com/en-au/about-us/global-infrastructure/expansion-regions-az/',
  SG:
    'https://www.ovhcloud.com/en-sg/about-us/global-infrastructure/expansion-regions-az/',
  FR:
    'https://www.ovhcloud.com/fr/about-us/global-infrastructure/expansion-regions-az/',
  WS:
    'https://www.ovhcloud.com/en/about-us/global-infrastructure/expansion-regions-az/',
  US:
    'https://www.ovhcloud.com/en/about-us/global-infrastructure/expansion-regions-az/',
  WE:
    'https://www.ovhcloud.com/en/about-us/global-infrastructure/expansion-regions-az/',
};

export const URL_INFO = {
  GLOBAL_REGIONS: GLOBAL_REGIONS_INFO_URL,
  LOCAL_ZONE: LOCAL_ZONE_INFO_URL,
  REGIONS_3AZ: REGIONS_3AZ_URL,
};

export const DEPLOYMENT_MODES_URL = {
  ASIA:
    'https://help.ovhcloud.com/csm/asia-public-cloud-deployments-modes?id=kb_article_view&sysparm_article=KB0066023',
  AU:
    'https://help.ovhcloud.com/csm/en-au-public-cloud-deployments-modes?id=kb_article_view&sysparm_article=KB0066022',
  CA:
    'https://help.ovhcloud.com/csm/en-ca-public-cloud-deployments-modes?id=kb_article_view&sysparm_article=KB0066032',
  GB:
    'https://help.ovhcloud.com/csm/en-gb-public-cloud-deployments-modes?id=kb_article_view&sysparm_article=KB0066027',
  IE:
    'https://help.ovhcloud.com/csm/en-ie-public-cloud-deployments-modes?id=kb_article_view&sysparm_article=KB0066035',
  IN:
    'https://help.ovhcloud.com/csm/asia-public-cloud-deployments-modes?id=kb_article_view&sysparm_article=KB0066023',
  SG:
    'https://help.ovhcloud.com/csm/en-sg-public-cloud-deployments-modes?id=kb_article_view&sysparm_article=KB0066026',
  DE:
    'https://help.ovhcloud.com/csm/de-public-cloud-deployments-modes?id=kb_article_view&sysparm_article=KB0066036',
  ES:
    'https://help.ovhcloud.com/csm/es-es-documentation-public-cloud?id=kb_browse_cat&kb_id=574a8325551974502d4c6e78b7421938',
  FR:
    'https://help.ovhcloud.com/csm/fr-public-cloud-deployments-modes?id=kb_article_view&sysparm_article=KB0066031',
  IT:
    'https://help.ovhcloud.com/csm/it-public-cloud-deployments-modes?id=kb_article_view&sysparm_article=KB0066033',
  MA:
    'https://help.ovhcloud.com/csm/fr-public-cloud-deployments-modes?id=kb_article_view&sysparm_article=KB0066031',
  SN:
    'https://help.ovhcloud.com/csm/fr-public-cloud-deployments-modes?id=kb_article_view&sysparm_article=KB0066031',
  TN:
    'https://help.ovhcloud.com/csm/fr-public-cloud-deployments-modes?id=kb_article_view&sysparm_article=KB0066031',
  NL:
    'https://help.ovhcloud.com/csm/en-ie-public-cloud-deployments-modes?id=kb_article_view&sysparm_article=KB0066035',
  PL:
    'https://help.ovhcloud.com/csm/pl-public-cloud-deployments-modes?id=kb_article_view&sysparm_article=KB0066030',
  PT:
    'https://help.ovhcloud.com/csm/pt-public-cloud-deployments-modes?id=kb_article_view&sysparm_article=KB0066025',
  QC:
    'https://help.ovhcloud.com/csm/fr-ca-public-cloud-deployments-modes?id=kb_article_view&sysparm_article=KB0066034',
  US:
    'https://help.ovhcloud.com/csm/en-public-cloud-deployments-modes?id=kb_article_view&sysparm_article=KB0066029',
  WS:
    'https://help.ovhcloud.com/csm/es-public-cloud-deployments-modes?id=kb_article_view&sysparm_article=KB0066028',
  DEFAULT:
    'https://help.ovhcloud.com/csm/en-public-cloud-deployments-modes?id=kb_article_view&sysparm_article=KB0066029',
};

export const DISCOVERY_PROJECT_PLANCODE = 'project.discovery';

export const DISCOVERY_PROJECT_ACTIVATION_PAYLOAD = {
  autoPayWithPreferredPaymentMethod: true,
  duration: 'P1M',
  pricingMode: 'default',
  quantity: 1,
};

export const FULL_PROJECT_PLANCODE = 'project.2018';

export default {
  PRODUCT_IMAGES,
  ACTIONS,
  DOCUMENTATION_LINKS,
  COMMUNITY_LINKS,
  PCI_HDS_ADDON,
  LEGACY_PLAN_CODES,
  API_GUIDES,
  TERRAFORM_GUIDES,
  DATABASE_CREATION_GUIDES,
  PCI_FEATURES,
  LOCAL_ZONE_REGION,
  THREE_AZ_REGION,
  ONE_AZ_REGION,
  HOURS_PER_MONTH,
  PLAN_ORDER,
  URL_INFO,
  DISCOVERY_PROJECT_PLANCODE,
  DISCOVERY_PROMOTION_VOUCHER,
  DISCOVERY_PROJECT_ACTIVATION_PAYLOAD,
  FULL_PROJECT_PLANCODE,
};
