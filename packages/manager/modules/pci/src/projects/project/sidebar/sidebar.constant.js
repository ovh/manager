import { PCI_FEATURES } from '../../projects.constant';

export const HORIZON = {
  CA: 'https://horizon.cloud.ovh.net/auth/login/',
  EU: 'https://horizon.cloud.ovh.net/auth/login/',
  US: 'https://horizon.cloud.ovh.us/auth/login/',
};

export const getMenu = ({ DBAAS_LOGS_URL }) => [
  {
    subitems: [
      {
        id: 'instance',
        options: {
          state: 'pci.projects.project.instances',
        },
        title: 'Instances',
        feature: PCI_FEATURES.PRODUCTS.INSTANCE,
      },
      {
        alpha: true,
        id: 'baremetal',
        options: {
          state: 'pci.projects.project.baremetal',
        },
        title: 'Bare Metal',
        feature: PCI_FEATURES.PRODUCTS.BAREMETAL,
      },
    ],
    title: 'Compute',
  },
  {
    subitems: [
      {
        id: 'block-storage',
        options: {
          state: 'pci.projects.project.storages.blocks',
        },
        title: 'Block Storage',
        feature: PCI_FEATURES.PRODUCTS.BLOCK_STORAGE,
      },
      {
        id: 'object-storage',
        options: {
          state: 'pci.projects.project.storages.object-storage',
        },
        title: 'Object Storage',
        feature: PCI_FEATURES.PRODUCTS.OBJECT_STORAGE,
      },
      {
        id: 'databases',
        new: true,
        options: {
          state: 'pci.projects.project.storages.databases',
        },
        title: 'Databases',
        feature: PCI_FEATURES.PRODUCTS.DATABASES,
      },
      {
        id: 'archive',
        options: {
          state: 'pci.projects.project.storages.archives',
        },
        title: 'Cloud Archive',
        feature: PCI_FEATURES.PRODUCTS.CLOUD_ARCHIVE,
      },
      {
        id: 'cold-archive',
        options: {
          state: 'pci.projects.project.storages.cold-archive',
        },
        title: 'Cold Archive',
        feature: PCI_FEATURES.PRODUCTS.COLD_ARCHIVE,
      },
      {
        id: 'snapshot',
        options: {
          state: 'pci.projects.project.storages.snapshots',
        },
        title: 'Volume Snapshot',
        feature: PCI_FEATURES.PRODUCTS.SNAPSHOT,
      },
      {
        id: 'instance-backup',
        options: {
          state: 'pci.projects.project.storages.instance-backups',
        },
        title: 'Instance Backup',
        feature: PCI_FEATURES.PRODUCTS.INSTANCE_BACKUP,
      },
    ],
    title: 'Storage',
  },
  {
    subitems: [
      {
        id: 'load-balancer',
        options: {
          state: 'pci.projects.project.loadbalancer',
        },
        title: 'Load Balancer',
        feature: PCI_FEATURES.PRODUCTS.LOAD_BALANCER,
      },
      {
        id: 'private-network',
        options: {
          state: 'pci.projects.project.privateNetwork',
        },
        title: 'Private Network',
        feature: PCI_FEATURES.PRODUCTS.PRIVATE_NETWORK,
      },
      {
        id: 'failover-ip',
        options: {
          state: 'pci.projects.project.failover-ips',
        },
        title: 'Failover IP',
        feature: PCI_FEATURES.PRODUCTS.FAILOVER_IP,
      },
    ],
    title: 'Network',
  },
  {
    subitems: [
      {
        id: 'kubernetes',
        options: {
          state: 'pci.projects.project.kubernetes',
        },
        title: 'Managed Kubernetes Service',
        feature: PCI_FEATURES.PRODUCTS.KUBERNETES,
      },
      {
        id: 'private-registry',
        options: {
          state: 'pci.projects.project.private-registry',
        },
        title: 'Managed Private Registry',
        feature: PCI_FEATURES.PRODUCTS.PRIVATE_REGISTRY,
      },
      {
        id: 'workflow-management',
        options: {
          state: 'pci.projects.project.workflow',
        },
        title: 'Workflow Management',
        feature: PCI_FEATURES.PRODUCTS.WORKFLOW_MANAGEMENT,
      },
    ],
    title: 'Containers & Orchestration',
  },
  {
    subitems: [
      {
        id: 'notebooks',
        options: {
          state: 'pci.projects.project.notebooks',
        },
        title: 'AI Notebooks',
        feature: PCI_FEATURES.PRODUCTS.NOTEBOOKS,
      },
      {
        id: 'training',
        options: {
          state: 'pci.projects.project.training',
        },
        title: 'AI Training',
        feature: PCI_FEATURES.PRODUCTS.TRAINING,
      },
      {
        id: 'apps',
        alpha: true,
        options: {
          state: 'pci.projects.project.ai',
        },
        title: 'AI Deploy',
        regions: ['CA', 'EU'],
        feature: PCI_FEATURES.PRODUCTS.AI_APPS,
      },
      {
        id: 'serving',
        options: {
          state: 'pci.projects.project.serving',
        },
        title: 'ML Serving',
        feature: PCI_FEATURES.PRODUCTS.SERVING,
      },
    ],
    regions: ['EU', 'CA'],
    title: 'AI & Machine Learning',
  },
  {
    subitems: [
      {
        id: 'data-processing',
        new: true,
        options: {
          state: 'pci.projects.project.data-processing',
        },
        title: 'Data Processing',
        feature: PCI_FEATURES.PRODUCTS.DATA_PROCESSING,
      },
      {
        id: 'logs-data-platform',
        options: {
          url: DBAAS_LOGS_URL,
          external: false,
        },
        title: 'Logs Data Platform',
        feature: PCI_FEATURES.PRODUCTS.LOGS_DATA_PLATFORM,
      },
    ],
    regions: ['EU', 'CA'],
    title: 'Data & Analytics',
  },
  {
    title: 'Management Interfaces',
    subitems: [
      {
        id: 'horizon',
        options: {
          url: HORIZON,
          target: '_blank',
          external: true,
        },
        title: 'Horizon',
        feature: PCI_FEATURES.PRODUCTS.HORIZON,
      },
    ],
  },
  {
    options: {
      icon: 'oui-icon oui-icon-gear_line',
      allowSubItems: true,
    },
    subitems: [
      {
        id: 'users',
        options: {
          state: 'pci.projects.project.users',
        },
        title: 'Users & Roles',
        feature: PCI_FEATURES.SETTINGS.USERS,
      },
      {
        id: 'quota',
        options: {
          state: 'pci.projects.project.quota',
        },
        title: 'Quota and Regions',
        feature: PCI_FEATURES.SETTINGS.QUOTA,
      },
      {
        id: 'ssh-keys',
        options: {
          state: 'pci.projects.project.sshKeys',
        },
        title: 'SSH Keys',
        feature: PCI_FEATURES.SETTINGS.SSH_KEYS,
      },
      {
        id: 'billing',
        options: {
          state: 'pci.projects.project.billing',
        },
        title: 'Billing Control',
        feature: PCI_FEATURES.SETTINGS.BILLING,
      },
      {
        id: 'vouchers',
        options: {
          state: 'pci.projects.project.vouchers',
        },
        title: 'Credit and Vouchers',
        feature: PCI_FEATURES.SETTINGS.VOUCHERS,
      },
      {
        id: 'contacts',
        options: {
          state: 'pci.projects.project.contacts',
        },
        title: 'Contacts and Rights',
        feature: PCI_FEATURES.SETTINGS.CONTACTS,
      },
      {
        id: 'management-settings',
        options: {
          state: 'pci.projects.project.edit',
        },
        title: 'Project settings',
        feature: PCI_FEATURES.SETTINGS.PROJECT_SETTINGS,
      },
    ],
    title: 'Project Management',
  },
];

export const UNIVERSE = 'Public Cloud';

export default {
  HORIZON,
  getMenu,
  UNIVERSE,
};
