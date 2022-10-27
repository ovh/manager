import { PCI_FEATURES as IMPORT_PCI_FEATURES } from '../projects.constant';

import ASSET_INSTANCES from './assets/instances.png';
import ASSET_DATABASES from './assets/databases.png';
import ASSET_KUBERNETES from './assets/kubernetes.png';
import ASSET_AINOTEBOOK from './assets/ainotebook.png';
import ASSET_OBJECTSTORAGE from './assets/objectstorage.png';
import ASSET_BLOCKSTORAGE from './assets/blockstorage.png';
import ASSET_IPFAILOVER from './assets/ipfailover.png';
import ASSET_PRIVATENETWORK from './assets/privatenetwork.png';

export const PCI_FEATURES = IMPORT_PCI_FEATURES;

export const PRODUCT_IMAGES = {
  instances: ASSET_INSTANCES,
  databases: ASSET_DATABASES,
  kubernetes: ASSET_KUBERNETES,
  ainotebook: ASSET_AINOTEBOOK,
  objectstorage: ASSET_OBJECTSTORAGE,
  blockstorage: ASSET_BLOCKSTORAGE,
  ipfailover: ASSET_IPFAILOVER,
  privatenetwork: ASSET_PRIVATENETWORK,
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
    translation: 'pci_projects_project_create_cluster_database',
    state: 'pci.projects.project.storages.databases.add',
    feature: PCI_FEATURES.PRODUCTS.DATABASES,
    name: 'databases',
  },
  {
    translation: 'pci_projects_project_create_ai_notebook',
    state: 'pci.projects.project.notebooks',
    feature: PCI_FEATURES.PRODUCTS.NOTEBOOKS,
    name: 'ainotebook',
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

export const LINKS = [
  {
    translation:
      'pci_projects_project_documentation_public_cloud_essential_information',
    href:
      'https://docs.ovh.com/gb/en/public-cloud/public-cloud-essential-information/',
    feature: PCI_FEATURES.LINKS.CLOUD_ESSENTIAL_INFORMATION,
  },
  {
    translation: 'pci_projects_project_documentation_public_cloud_interface',
    href: 'https://docs.ovh.com/gb/en/public-cloud/public-cloud-interface/',
    feature: PCI_FEATURES.LINKS.PUBLIC_CLOUD_INTERFACE,
  },
  {
    translation:
      'pci_projects_project_documentation_get_started_with_a_public_cloud_instance',
    href:
      'https://docs.ovh.com/gb/en/public-cloud/get-started-with-a-public-cloud-instance/',
    feature: PCI_FEATURES.LINKS.START_PCI_INSTANCE,
  },
  {
    translation:
      'pci_projects_project_documentation_information_on_cloud_billing_options',
    href:
      'https://docs.ovh.com/gb/en/public-cloud/information-on-cloud-billing-options/',
    feature: PCI_FEATURES.LINKS.CLOUD_BILLING_OPTIONS,
  },
  {
    translation:
      'pci_projects_project_documentation_see_all_public_cloud_guides',
    href: 'https://docs.ovh.com/gb/en/',
    feature: PCI_FEATURES.LINKS.ALL_GUIDES,
  },
  {
    translation:
      'pci_projects_project_documentation_how_to_create_a_horizon_user',
    href: 'https://support.us.ovhcloud.com/hc/en-us/articles/360008644539',
    feature: PCI_FEATURES.LINKS.CREATE_HORIZON_USER,
  },
  {
    translation:
      'pci_projects_project_documentation_how_to_deploy_a_public_cloud_instance',
    href: 'https://support.us.ovhcloud.com/hc/en-us/articles/360002245164',
    feature: PCI_FEATURES.LINKS.DEPLOY_A_PUBLIC_CLOUD_INSTANCE,
  },
  {
    translation:
      'pci_projects_project_documentation_getting_started_with_block_storage',
    href: 'https://support.us.ovhcloud.com/hc/en-us/articles/360002157044',
    feature: PCI_FEATURES.LINKS.START_WITH_BLOCK_STORAGE,
  },
  {
    translation:
      'pci_projects_project_documentation_see_all_public_cloud_guides',
    href: 'https://support.us.ovhcloud.com/hc/en-us/categories/115000515130',
    feature: PCI_FEATURES.LINKS.ALL_GUIDES_US,
  },
];

export const COMMUNITY_LINKS = [
  {
    translation: 'pci_projects_project_community_roadmap',
    href: 'https://github.com/ovh/public-cloud-roadmap/projects',
    regions: ['EU', 'CA'],
  },
  {
    translation: 'pci_projects_project_community_discord',
    href: 'https://discord.com/invite/C9VVJZxxd6',
    regions: ['EU', 'CA'],
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

export const PCI_HDS_ADDON = {
  productName: 'cloud',
  family: 'certification-hds',
  parentPlanCode: 'project.2018',
  planCodeScope: 'certification.hds',
  certifiedProject: 'publiccloud-certification-hds',
  planCode: 'certification.hds.2018',
};

export const LEGACY_PLAN_CODES = ['project.legacy', 'project.2018'];

export default {
  PRODUCT_IMAGES,
  ACTIONS,
  LINKS,
  COMMUNITY_LINKS,
  PCI_HDS_ADDON,
  LEGACY_PLAN_CODES,
  API_GUIDES,
  PCI_FEATURES,
};
