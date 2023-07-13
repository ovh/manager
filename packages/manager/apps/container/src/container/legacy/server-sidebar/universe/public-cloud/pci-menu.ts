export type PciMenuItem = {
  id: string;
  title: string;
  href?: string;
  external?: boolean;
  feature?: string;
  subItems?: PciMenuItem[];
  regions?: string[];
  badge?: string;
};

export const features = [
  'instance',
  'pci-baremetal',
  'block-storage',
  'object-storage',
  'databases',
  'archive',
  'cold-archive',
  'snapshot',
  'volume-backup',
  'instance-backup',
  'private-network',
  'failover-ip',
  'additional-ips',
  'public-gateways',
  'load-balancer',
  'kubernetes',
  'private-registry',
  'workflow-management',
  'notebooks',
  'training',
  'ai-apps',
  'data-processing',
  'logs-data-platform',
  'horizon',
  'public-cloud:users',
  'public-cloud:quota',
  'public-cloud:ssh-keys',
  'public-cloud:billing',
  'public-cloud:vouchers',
  'public-cloud:contacts',
  'public-cloud:project-settings',
  'ai-dashboard',
  'data-integration',
];

export function getPciProjectMenu(
  projectId: string,
  region: string,
  getURL: (app: string, path: string) => string,
): PciMenuItem[] {
  return [
    {
      id: 'compute',
      title: 'Compute',
      subItems: [
        {
          id: 'instance',
          title: 'Instances',
          feature: 'instance',
          href: getURL('public-cloud', `#/pci/projects/${projectId}/instances`),
        },
      ],
    },
    {
      id: 'storage',
      title: 'Storage',
      subItems: [
        {
          id: 'block-storage',
          title: 'Block Storage',
          feature: 'block-storage',
          href: getURL(
            'public-cloud',
            `#/pci/projects/${projectId}/storages/blocks`,
          ),
        },
        {
          id: 'object-storage',
          title: 'Object Storage',
          feature: 'object-storage',
          href: getURL(
            'public-cloud',
            `#/pci/projects/${projectId}/storages/objects`,
          ),
        },
        {
          id: 'archive',
          title: 'Cloud Archive',
          feature: 'archive',
          href: getURL(
            'public-cloud',
            `#/pci/projects/${projectId}/storages/cloud-archives`,
          ),
        },
        {
          id: 'cold-archive',
          title: 'Cold Archive',
          badge: 'new',
          feature: 'cold-archive',
          href: getURL(
            'public-cloud',
            `#/pci/projects/${projectId}/storages/cold-archive`,
          ),
        },
        {
          id: 'databases',
          title: 'Databases',
          badge: 'new',
          feature: 'databases',
          href: getURL(
            'public-cloud',
            `#/pci/projects/${projectId}/storages/databases`,
          ),
        },
        {
          id: 'snapshot',
          title: 'Volume Snapshot',
          feature: 'snapshot',
          href: getURL(
            'public-cloud',
            `#/pci/projects/${projectId}/storages/volume-snapshots`,
          ),
        },
        {
          id: 'volume-backup',
          title: 'Volume Backup',
          feature: 'volume-backup',
          badge: 'new',
          href: getURL(
            'public-cloud',
            `#/pci/projects/${projectId}/storages/volume-backup`,
          ),
        },
        {
          id: 'instance-backup',
          title: 'Instance Backup',
          feature: 'instance-backup',
          href: getURL(
            'public-cloud',
            `#/pci/projects/${projectId}/storages/instance-backups`,
          ),
        },
      ],
    },
    {
      id: 'network',
      title: 'Network',
      subItems: [
        {
          id: 'private-network',
          title: 'Private Network',
          feature: 'private-network',
          href: getURL(
            'public-cloud',
            `#/pci/projects/${projectId}/private-networks`,
          ),
        },
        {
          id: 'failover-ip',
          title: 'Failover IP',
          feature: 'failover-ip',
          href: getURL(
            'public-cloud',
            `#/pci/projects/${projectId}/failover-ips`,
          ),
        },
        {
          id: 'additional-ips',
          title: 'Public IPs',
          feature: 'additional-ips',
          href: getURL(
            'public-cloud',
            `#/pci/projects/${projectId}/public-ips`,
          ),
        },
        {
          id: 'public-gateways',
          title: 'Gateway',
          feature: 'public-gateways',
          href: getURL('public-cloud', `#/pci/projects/${projectId}/gateway`),
        },
      ],
    },
    {
      id: 'containers',
      title: 'Containers & Orchestration',
      subItems: [
        {
          id: 'load-balancer',
          title: 'Load Balancer',
          feature: 'load-balancer',
          href: getURL(
            'public-cloud',
            `#/pci/projects/${projectId}/load-balancer`,
          ),
        },
        {
          id: 'kubernetes',
          title: 'Managed Kubernetes Service',
          feature: 'kubernetes',
          href: getURL(
            'public-cloud',
            `#/pci/projects/${projectId}/kubernetes`,
          ),
        },
        {
          id: 'private-registry',
          title: 'Managed Private Registry',
          feature: 'private-registry',
          href: getURL(
            'public-cloud',
            `#/pci/projects/${projectId}/private-registry`,
          ),
        },
        {
          id: 'workflow-management',
          title: 'Workflow Management',
          feature: 'workflow-management',
          href: getURL('public-cloud', `#/pci/projects/${projectId}/workflow`),
        },
      ],
    },
    {
      id: 'ai',
      title: 'AI & Machine Learning',
      regions: ['EU', 'CA'],
      subItems: [
        {
          id: 'dashboard',
          title: 'AI Dashboard',
          badge: 'new',
          feature: 'ai-dashboard',
          href: getURL('public-cloud', `#/pci/projects/${projectId}/ai-dashboard`),
        },
        {
          id: 'notebooks',
          title: 'AI Notebooks',
          feature: 'notebooks',
          href: getURL('public-cloud', `#/pci/projects/${projectId}/notebooks`),
        },
        {
          id: 'training',
          title: 'AI Training',
          feature: 'training',
          href: getURL('public-cloud', `#/pci/projects/${projectId}/training`),
        },
        {
          id: 'apps',
          title: 'AI Deploy',
          badge: 'new',
          regions: ['CA', 'EU'],
          feature: 'ai-apps',
          href: getURL('public-cloud', `#/pci/projects/${projectId}/ai/apps`),
        },
      ],
    },
    {
      id: 'analytics',
      title: 'Data & Analytics',
      regions: ['EU', 'CA'],
      subItems: [
        {
          id: 'data-processing',
          title: 'Data Processing',
          badge: 'new',
          feature: 'data-processing',
          href: getURL(
            'public-cloud',
            `#/pci/projects/${projectId}/data-processing`,
          ),
        },
        {
          id: 'data-integration',
          title: 'Data Integration',
          badge: 'beta',
          feature: 'data-integration',
          href: getURL(
            'public-cloud',
            `#/pci/projects/${projectId}/data-integration`,
          ),
        },
        {
          id: 'logs-data-platform',
          title: 'Logs Data Platform',
          feature: 'logs-data-platform',
          href: getURL('dedicated', `#/dbaas/logs`),
        },
      ],
    },
    {
      id: 'management',
      title: 'Management Interfaces',
      subItems: [
        {
          id: 'horizon',
          title: 'Horizon',
          feature: 'horizon',
          href: {
            CA: 'https://horizon.cloud.ovh.net/auth/login/',
            EU: 'https://horizon.cloud.ovh.net/auth/login/',
            US: 'https://horizon.cloud.ovh.us/auth/login/',
          }[region],
          external: true,
        },
      ],
    },
    {
      id: 'project',
      title: 'Project Management',
      subItems: [
        {
          id: 'users',
          title: 'Users & Roles',
          feature: 'public-cloud:users',
          href: getURL('public-cloud', `#/pci/projects/${projectId}/users`),
        },
        {
          id: 'quota',
          title: 'Quota and Regions',
          feature: 'public-cloud:quota',
          href: getURL('public-cloud', `#/pci/projects/${projectId}/quota`),
        },
        {
          id: 'ssh-keys',
          title: 'SSH Keys',
          feature: 'public-cloud:ssh-keys',
          href: getURL('public-cloud', `#/pci/projects/${projectId}/ssh`),
        },
        {
          id: 'billing',
          title: 'Billing Control',
          feature: 'public-cloud:billing',
          href: getURL('public-cloud', `#/pci/projects/${projectId}/billing`),
        },
        {
          id: 'vouchers',
          title: 'Credit and Vouchers',
          feature: 'public-cloud:vouchers',
          href: getURL('public-cloud', `#/pci/projects/${projectId}/vouchers`),
        },
        {
          id: 'contacts',
          title: 'Contacts and Rights',
          feature: 'public-cloud:contacts',
          href: getURL('public-cloud', `#/pci/projects/${projectId}/contacts`),
        },
        {
          id: 'management-settings',
          title: 'Project settings',
          feature: 'public-cloud:project-settings',
          href: getURL('public-cloud', `#/pci/projects/${projectId}/edit`),
        },
      ],
    },
  ];
}
