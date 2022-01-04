import ASSET_INSTANCES from './assets/instances.png';
import ASSET_DATABASES from './assets/databases.png';
import ASSET_KUBERNETES from './assets/kubernetes.png';
import ASSET_AINOTEBOOK from './assets/ainotebook.png';
import ASSET_OBJECTSTORAGE from './assets/objectstorage.png';
import ASSET_BLOCKSTORAGE from './assets/blockstorage.png';
import ASSET_IPFAILOVER from './assets/ipfailover.png';
import ASSET_PRIVATENETWORK from './assets/privatenetwork.png';

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
    name: 'instances',
  },
  {
    translation: 'pci_projects_project_create_cluster_kubernetes',
    state: 'pci.projects.project.kubernetes.add',
    feature: 'kubernetes',
    name: 'kubernetes',
  },
  {
    translation: 'pci_projects_project_create_a_container',
    state: 'pci.projects.project.storages.object-storage.add',
    name: 'objectstorage',
  },
  {
    translation: 'pci_projects_project_create_a_volume',
    state: 'pci.projects.project.storages.blocks.add',
    name: 'blockstorage',
  },
  {
    translation: 'pci_projects_project_create_cluster_database',
    state: 'pci.projects.project.storages.databases.add',
    feature: 'databases',
    name: 'databases',
  },
  {
    translation: 'pci_projects_project_create_ai_notebook',
    state: 'pci.projects.project.notebooks',
    feature: 'notebooks',
    name: 'ainotebook',
  },
  {
    translation: 'pci_projects_project_activate_private_networks',
    state: 'pci.projects.project.privateNetwork',
    name: 'privatenetwork',
  },
  {
    translation: 'pci_projects_project_buy_ip_failover',
    state: 'pci.projects.project.failover-ips',
    name: 'ipfailover',
  },
];

export const LINKS = [
  {
    translation:
      'pci_projects_project_documentation_public_cloud_essential_information',
    href:
      'https://docs.ovh.com/gb/en/public-cloud/public-cloud-essential-information/',
    regions: ['EU', 'CA'],
  },
  {
    translation: 'pci_projects_project_documentation_public_cloud_interface',
    href: 'https://docs.ovh.com/gb/en/public-cloud/public-cloud-interface/',
    regions: ['EU', 'CA'],
  },
  {
    translation:
      'pci_projects_project_documentation_get_started_with_a_public_cloud_instance',
    href:
      'https://docs.ovh.com/gb/en/public-cloud/get-started-with-a-public-cloud-instance/',
    regions: ['EU', 'CA'],
  },
  {
    translation:
      'pci_projects_project_documentation_information_on_cloud_billing_options',
    href:
      'https://docs.ovh.com/gb/en/public-cloud/information-on-cloud-billing-options/',
    regions: ['EU', 'CA'],
  },
  {
    translation:
      'pci_projects_project_documentation_see_all_public_cloud_guides',
    href: 'https://docs.ovh.com/gb/en/',
    regions: ['EU', 'CA'],
  },
  {
    translation:
      'pci_projects_project_documentation_how_to_create_a_horizon_user',
    href: 'https://support.us.ovhcloud.com/hc/en-us/articles/360008644539',
    regions: ['US'],
  },
  {
    translation:
      'pci_projects_project_documentation_how_to_deploy_a_public_cloud_instance',
    href: 'https://support.us.ovhcloud.com/hc/en-us/articles/360002245164',
    regions: ['US'],
  },
  {
    translation:
      'pci_projects_project_documentation_getting_started_with_block_storage',
    href: 'https://support.us.ovhcloud.com/hc/en-us/articles/360002157044',
    regions: ['US'],
  },
  {
    translation:
      'pci_projects_project_documentation_see_all_public_cloud_guides',
    href: 'https://support.us.ovhcloud.com/hc/en-us/categories/115000515130',
    regions: ['US'],
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
};
