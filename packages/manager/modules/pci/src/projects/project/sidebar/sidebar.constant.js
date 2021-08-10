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
      },
      {
        alpha: true,
        id: 'baremetal',
        options: {
          state: 'pci.projects.project.baremetal',
        },
        title: 'Bare Metal',
        regions: ['EU', 'CA'],
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
      },
      {
        id: 'object-storage',
        options: {
          state: 'pci.projects.project.storages.objects',
        },
        title: 'Object Storage',
      },
      {
        id: 'databases',
        new: true,
        options: {
          state: 'pci.projects.project.storages.databases',
        },
        title: 'Databases',
        feature: 'databases',
      },
      {
        id: 'archive',
        options: {
          state: 'pci.projects.project.storages.archives',
        },
        title: 'Cloud Archive',
      },
      {
        id: 'snapshot',
        options: {
          state: 'pci.projects.project.storages.snapshots',
        },
        title: 'Volume Snapshot',
      },
      {
        id: 'instance-backup',
        options: {
          state: 'pci.projects.project.storages.instance-backups',
        },
        title: 'Instance Backup',
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
        feature: 'load-balancer',
      },
      {
        id: 'private-network',
        options: {
          state: 'pci.projects.project.privateNetwork',
        },
        title: 'Private Network',
      },
      {
        id: 'failover-ip',
        options: {
          state: 'pci.projects.project.failover-ips',
        },
        title: 'Failover IP',
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
        feature: 'kubernetes',
      },
      {
        id: 'private-registry',
        options: {
          state: 'pci.projects.project.private-registry',
        },
        title: 'Managed Private Registry',
        regions: ['CA', 'EU'],
      },
      {
        id: 'workflow-management',
        options: {
          state: 'pci.projects.project.workflow',
        },
        title: 'Workflow Management',
        regions: ['CA', 'EU'],
      },
    ],
    title: 'Containers & Orchestration',
  },
  {
    subitems: [
      {
        id: 'notebooks',
        beta: true,
        options: {
          state: 'pci.projects.project.notebooks',
        },
        title: 'AI Notebooks',
        regions: ['CA', 'EU'],
      },
      {
        id: 'training',
        new: true,
        options: {
          state: 'pci.projects.project.training',
        },
        title: 'AI Training',
        regions: ['CA', 'EU'],
        feature: 'ai-training',
      },
      {
        id: 'serving',
        new: true,
        options: {
          state: 'pci.projects.project.serving',
        },
        title: 'ML Serving',
        regions: ['EU', 'CA'],
      },
    ],
    regions: ['EU', 'CA'],
    title: 'AI & Machine Learning',
  },
  {
    subitems: [
      {
        id: 'analytics-data-platform',
        options: {
          state: 'pci.projects.project.analytics-data-platform',
        },
        title: 'Analytics Data Platform',
        regions: ['EU'],
      },
      {
        id: 'data-processing',
        new: true,
        options: {
          state: 'pci.projects.project.data-processing',
        },
        title: 'Data Processing',
        regions: ['EU', 'CA'],
      },
      {
        id: 'logs-data-platform',
        options: {
          url: DBAAS_LOGS_URL,
          external: false,
        },
        title: 'Logs Data Platform',
        regions: ['EU', 'CA'],
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
      },
      {
        id: 'quota',
        options: {
          state: 'pci.projects.project.quota',
        },
        title: 'Quota and Regions',
      },
      {
        id: 'ssh-keys',
        options: {
          state: 'pci.projects.project.sshKeys',
        },
        title: 'SSH Keys',
      },
      {
        id: 'billing',
        options: {
          state: 'pci.projects.project.billing',
        },
        feature: 'public-cloud:billing',
        title: 'Billing Control',
      },
      {
        id: 'vouchers',
        options: {
          state: 'pci.projects.project.vouchers',
        },
        regions: ['EU', 'CA'],
        title: 'Credit and Vouchers',
      },
      {
        id: 'contacts',
        options: {
          state: 'pci.projects.project.contacts',
        },
        regions: ['EU', 'CA'],
        title: 'Contacts and Rights',
      },
      {
        id: 'management-settings',
        options: {
          state: 'pci.projects.project.edit',
        },
        title: 'Project settings',
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
