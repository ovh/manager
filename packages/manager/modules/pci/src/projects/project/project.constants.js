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
      'pci_projects_project_documentation_create_user_access_to_horizon',
    href:
      'https://docs.ovh.com/gb/en/public-cloud/configure_user_access_to_horizon/',
    regions: ['EU', 'CA'],
  },
  {
    translation:
      'pci_projects_project_documentation_boot_your_first_cloud_server_in_3_minutes',
    href:
      'https://docs.ovh.com/gb/en/public-cloud/create_an_instance_in_your_ovh_customer_account',
    regions: ['EU', 'CA'],
  },
  {
    translation:
      'pci_projects_project_documentation_prepare_the_environment_for_using_the_open_stack_api',
    href:
      'https://docs.ovh.com/gb/en/public-cloud/prepare_the_environment_for_using_the_openstack_api/',
    regions: ['EU', 'CA'],
  },
  {
    translation:
      'pci_projects_project_documentation_create_and_configure_and_additional_disk_on_an_instance',
    href:
      'https://docs.ovh.com/gb/en/public-cloud/create-an-additional-volume-and-attach-it-to-an-instance/',
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
