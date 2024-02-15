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
  'additional-ips',
  'public-gateways',
  'octavia-load-balancer',
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
        {
          id: 'workflow-management',
          title: 'Workflow Management',
          feature: 'workflow-management',
          href: getURL('public-cloud', `#/pci/projects/${projectId}/workflow`),
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
          id: 'octavia-load-balancer',
          title: 'Load Balancer',
          feature: 'octavia-load-balancer',
          badge: 'new',
          href: getURL(
            'public-cloud',
            `#/pci/projects/${projectId}/octavia-load-balancer`,
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
          id: 'kubernetes',
          title: 'Managed Kubernetes Service',
          feature: 'kubernetes',
          href: getURL(
            'public-cloud',
            `#/pci/projects/${projectId}/kubernetes`,
          ),
        },
        {
          id: 'load-balancer',
          title: 'Kubernetes Load Balancer',
          feature: 'load-balancer',
          href: getURL(
            'public-cloud',
            `#/pci/projects/${projectId}/load-balancer`,
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
      ],
    },
    {
      id: 'analytics',
      title: 'Databases & Analytics',
      regions: ['EU', 'CA', 'US'],
      subItems: [

        {
          id: 'databases',
          title: 'Databases',
          feature: 'databases',
          href: getURL(
            'public-cloud',
            `#/pci/projects/${projectId}/storages/databases-analytics/databases`,
          ),
        },
        {
          id: 'databases-streaming',
          title: 'Data Streaming',
          feature: 'databases',
          href: getURL(
            'public-cloud',
            `#/pci/projects/${projectId}/storages/databases-analytics/data-streaming`,
          ),
        },
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
          id: 'databases-analysis',
          title: 'Data Analysis',
          feature: 'databases',
          href: getURL(
            'public-cloud',
            `#/pci/projects/${projectId}/storages/databases-analytics/data-analysis`,
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
      id: 'management',
      title: 'Management Interfaces',
      subItems: [
        {
          id: 'horizon',
          title: 'Horizon',
          feature: 'horizon',
          href: {
            CA: 'https://auth.cloud.ovh.net/v3/auth/OS-FEDERATION/identity_providers/ovhcloud-world/protocols/openid/websso?origin=https://horizon.cloud.ovh.net/auth/websso/',
            EU: 'https://auth.cloud.ovh.net/v3/auth/OS-FEDERATION/identity_providers/ovhcloud-emea/protocols/openid/websso?origin=https://horizon.cloud.ovh.net/auth/websso/',
            US: 'https://auth.cloud.ovh.us/v3/auth/OS-FEDERATION/identity_providers/ovhcloud-us/protocols/openid/websso?origin=https://horizon.cloud.ovh.us/auth/websso/',
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
