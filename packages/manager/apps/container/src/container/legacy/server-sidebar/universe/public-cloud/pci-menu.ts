export type PciMenuItem = {
  id: string;
  title: string;
  href?: string;
  external?: boolean;
  subItems?: PciMenuItem[];
  badge?: string;
};

export const features = [
  'instance',
  'pci-baremetal',
  'block-storage',
  'object-storage',
  'pci-ai-dashboard',
  'pci-ai-notebooks',
  'pci-ai-training',
  'pci-ai-deploy',
  'pci-databases-analytics-operational',
  'pci-databases-analytics-streaming',
  'pci-databases-analytics-analysis',
  'pci-dataplatform',
  'archive',
  'cold-archive',
  'snapshot',
  'volume-backup',
  'instance-backup',
  'private-network',
  'additional-ips',
  'public-gateways',
  'pci-load-balancer',
  'load-balancer',
  'kubernetes',
  'private-registry',
  'workflow-management',
  'logs-data-platform',
  'horizon',
  'pci-rancher',
  'public-cloud:users',
  'public-cloud:quota',
  'public-cloud:ssh-keys',
  'public-cloud:billing',
  'public-cloud:vouchers',
  'public-cloud:contacts',
  'public-cloud:project-settings',
  'data-platform',
  'key-management-service',
  'okms',
  'okms:key-management-service',
  'okms:secret-manager',
  'pci-savings-plan',
  'pci-ai-endpoints',
  'pci-quantum-emulators',
  'pci-quantum-qpu',
];

export function getPciProjectMenu(
  projectId: string,
  region: string,
  featureAvailabilities: Record<string, boolean>,
  getURL: (app: string, path: string) => string,
): PciMenuItem[] {
  const pciMenu: PciMenuItem[] = [];

  const isFeaturesAvailable = (...features: string[]): boolean =>
    features.some((feature: string) => featureAvailabilities[feature]);

  if (isFeaturesAvailable('instance')) {
    pciMenu.push({
      id: 'compute',
      title: 'Compute',
      subItems: [
        {
          id: 'instance',
          title: 'Instances',
          href: getURL('public-cloud', `#/pci/projects/${projectId}/instances`),
        },
        isFeaturesAvailable('instance-backup') && {
          id: 'instance-backup',
          title: 'Instance Backup',
          href: getURL(
            'public-cloud',
            `#/pci/projects/${projectId}/storages/instance-backups`,
          ),
        },
        isFeaturesAvailable('workflow-management') && {
          id: 'workflow-management',
          title: 'Workflow Management',
          href: getURL('public-cloud', `#/pci/projects/${projectId}/workflow`),
        },
      ],
    });
  }

  if (
    isFeaturesAvailable(
      'block-storage',
      'object-storage',
      'archive',
      'cold-archive',
      'snapshot',
      'volume-backup',
      'instance-backup',
      'workflow-management',
    )
  ) {
    pciMenu.push({
      id: 'storage',
      title: 'Storage',
      subItems: [
        isFeaturesAvailable('block-storage') && {
          id: 'block-storage',
          title: 'Block Storage',
          href: getURL(
            'public-cloud',
            `#/pci/projects/${projectId}/storages/blocks`,
          ),
        },
        isFeaturesAvailable('volume-backup') && {
          id: 'volume-backup',
          title: 'Volume Backup',
          badge: 'new',
          href: getURL(
            'public-cloud',
            `#/pci/projects/${projectId}/storages/volume-backup`,
          ),
        },
        isFeaturesAvailable('snapshot') && {
          id: 'snapshot',
          title: 'Volume Snapshot',
          href: getURL(
            'public-cloud',
            `#/pci/projects/${projectId}/storages/volume-snapshots`,
          ),
        },
        isFeaturesAvailable('object-storage') && {
          id: 'object-storage',
          title: 'Object Storage',
          href: getURL(
            'public-cloud',
            `#/pci/projects/${projectId}/storages/objects`,
          ),
        },
        isFeaturesAvailable('cold-archive') && {
          id: 'cold-archive',
          title: 'Cold Archive',
          badge: 'new',
          href: getURL(
            'public-cloud',
            `#/pci/projects/${projectId}/storages/cold-archive`,
          ),
        },
        isFeaturesAvailable('archive') && {
          id: 'archive',
          title: 'Cloud Archive',
          href: getURL(
            'public-cloud',
            `#/pci/projects/${projectId}/storages/cloud-archives`,
          ),
        },
      ],
    });
  }

  if (
    isFeaturesAvailable(
      'private-network',
      'pci-load-balancer',
      'additional-ips',
      'public-gateways',
    )
  ) {
    pciMenu.push({
      id: 'network',
      title: 'Network',
      subItems: [
        isFeaturesAvailable('private-network') && {
          id: 'private-network',
          title: 'Private Network',
          href: getURL(
            'public-cloud',
            `#/pci/projects/${projectId}/private-networks`,
          ),
        },
        isFeaturesAvailable('pci-load-balancer') && {
          id: 'pci-load-balancer',
          title: 'Load Balancer',
          badge: 'new',
          href: getURL(
            'public-cloud',
            `#/pci/projects/${projectId}/octavia-load-balancer`,
          ),
        },
        isFeaturesAvailable('additional-ips') && {
          id: 'additional-ips',
          title: 'Public IPs',
          href: getURL(
            'public-cloud',
            `#/pci/projects/${projectId}/public-ips`,
          ),
        },
        isFeaturesAvailable('public-gateways') && {
          id: 'public-gateways',
          title: 'Gateway',
          href: getURL('public-cloud', `#/pci/projects/${projectId}/gateway`),
        },
      ],
    });
  }

  if (
    isFeaturesAvailable(
      'pci-rancher',
      'kubernetes',
      'private-registry',
      'load-balancer',
    )
  ) {
    pciMenu.push({
      id: 'containers',
      title: 'Containers & Orchestration',
      subItems: [
        isFeaturesAvailable('pci-rancher') && {
          id: 'rancher',
          title: 'Managed Rancher Service',
          href: getURL('public-cloud', `#/pci/projects/${projectId}/rancher`),
          badge: 'new',
        },
        isFeaturesAvailable('kubernetes') && {
          id: 'kubernetes',
          title: 'Managed Kubernetes Service',
          href: getURL(
            'public-cloud',
            `#/pci/projects/${projectId}/kubernetes`,
          ),
        },
        isFeaturesAvailable('private-registry') && {
          id: 'private-registry',
          title: 'Managed Private Registry',
          href: getURL(
            'public-cloud',
            `#/pci/projects/${projectId}/private-registry`,
          ),
        },
        isFeaturesAvailable('load-balancer') && {
          id: 'load-balancer',
          title: 'Kubernetes Load Balancer',
          href: getURL(
            'public-cloud',
            `#/pci/projects/${projectId}/load-balancer`,
          ),
        },
      ],
    });
  }

  if (
    isFeaturesAvailable(
      'pci-databases-analytics-operational',
      'pci-databases-analytics-streaming',
      'pci-databases-analytics-analysis',
      'pci-dataplatform',
      'data-platform',
      'logs-data-platform',
    )
  ) {
    pciMenu.push({
      id: 'analytics',
      title: 'Databases & Analytics',
      subItems: [
        // Entry menu for PCI Databases for React
        isFeaturesAvailable('pci-databases-analytics-operational') && {
          id: 'pci-databases-analytics-operational',
          title: 'Databases',
          href: getURL(
            'public-cloud',
            `#/pci/projects/${projectId}/databases-analytics/operational/services`,
          ),
        },
        // Entry menu for PCI Data Streaming for React
        isFeaturesAvailable('pci-databases-analytics-streaming') && {
          id: 'pci-databases-analytics-streaming',
          title: 'Data Streaming',
          href: getURL(
            'public-cloud',
            `#/pci/projects/${projectId}/databases-analytics/streaming/services`,
          ),
        },
        // Entry menu for PCI Data Analysis for React
        isFeaturesAvailable('pci-databases-analytics-analysis') && {
          id: 'pci-databases-analytics-analysis',
          title: 'Data Analysis',
          href: getURL(
            'public-cloud',
            `#/pci/projects/${projectId}/databases-analytics/analysis/services`,
          ),
        },
        isFeaturesAvailable('data-platform') && {
          id: 'data-platform',
          title: 'Data Platform',
          href: `https://hq-api.eu.dataplatform.ovh.net/iam/v4/login?authentication_provider=ovh&project=${projectId}&app_id=forepaas&&response_type=token&redirect_uri=https%3A%2F%2Feu.dataplatform.ovh.net&authorize_bypass=true&token_mode=cookie&force_auth=false`,
          badge: 'new',
          external: true,
        },
        isFeaturesAvailable('pci-dataplatform') && {
          id: 'pci-dataplatform',
          title: 'Data Platform',
          badge: 'new',
          href: getURL(
            'public-cloud',
            `#/pci/projects/${projectId}/dataplatform`,
          ),
        },
        isFeaturesAvailable('logs-data-platform') && {
          id: 'logs-data-platform',
          title: 'Logs Data Platform',
          href: getURL('dedicated', `#/dbaas/logs`),
        },
      ],
    });
  }

  if (
    isFeaturesAvailable(
      'pci-ai-endpoints',
      'pci-ai-dashboard',
      'pci-ai-notebooks',
      'pci-ai-training',
      'pci-ai-deploy',
    )
  ) {
    pciMenu.push({
      id: 'ai',
      title: 'AI & Machine Learning',
      subItems: [
        isFeaturesAvailable('pci-ai-dashboard') && {
          id: 'pci-dashboard',
          title: 'AI Dashboard',
          href: getURL(
            'public-cloud',
            `#/pci/projects/${projectId}/ai-ml/dashboard`,
          ),
        },
        isFeaturesAvailable('pci-ai-notebooks') && {
          id: 'pci-notebooks',
          title: 'AI Notebooks',
          href: getURL(
            'public-cloud',
            `#/pci/projects/${projectId}/ai-ml/notebooks`,
          ),
        },
        isFeaturesAvailable('pci-ai-training') && {
          id: 'pci-training',
          title: 'AI Training',
          href: getURL(
            'public-cloud',
            `#/pci/projects/${projectId}/ai-ml/training`,
          ),
        },
        isFeaturesAvailable('pci-ai-deploy') && {
          id: 'pci-deploy',
          title: 'AI Deploy',
          href: getURL(
            'public-cloud',
            `#/pci/projects/${projectId}/ai-ml/deploy`,
          ),
        },
        isFeaturesAvailable('pci-ai-endpoints') && {
          id: 'pci-ai-endpoints',
          title: 'AI Endpoints',
          badge: 'new',
          href: getURL(
            'public-cloud',
            `#/pci/projects/${projectId}/ai/endpoints`,
          ),
        },
      ],
    });
  }

  if (
    isFeaturesAvailable(
      'pci-quantum-emulators',
      'pci-quantum-qpu',
    )
  ) {
    pciMenu.push({
      id: 'quantum',
      title: 'Quantum',
      subItems: [
        isFeaturesAvailable('pci-quantum-emulators') &&  {
          id: 'pci-quantum-emulators',
          title: 'Emulators',
          href: getURL(
            'public-cloud',
            `#/pci/projects/${projectId}/ai-ml/quantum/notebooks`,
          ),
        },
        isFeaturesAvailable('pci-quantum-qpu') &&  {
           id: 'pci-quantum-qpu',
           title: 'QPUs',
           badge: 'new',
           href: getURL(
             'public-cloud',
             `#/pci/projects/${projectId}/ai-ml/quantum/qpu`,
           ),
         },
      ],
    });
  }

  if (isFeaturesAvailable('horizon')) {
    pciMenu.push({
      id: 'management',
      title: 'Management Interfaces',
      subItems: [
        {
          id: 'horizon',
          title: 'Horizon',
          href: {
            CA:
              'https://auth.cloud.ovh.net/v3/auth/OS-FEDERATION/identity_providers/ovhcloud-world/protocols/openid/websso?origin=https://horizon.cloud.ovh.net/auth/websso/',
            EU:
              'https://auth.cloud.ovh.net/v3/auth/OS-FEDERATION/identity_providers/ovhcloud-emea/protocols/openid/websso?origin=https://horizon.cloud.ovh.net/auth/websso/',
            US:
              'https://auth.cloud.ovh.us/v3/auth/OS-FEDERATION/identity_providers/ovhcloud-us/protocols/openid/websso?origin=https://horizon.cloud.ovh.us/auth/websso/',
          }[region],
          external: true,
        },
      ],
    });
  }

  if (isFeaturesAvailable('key-management-service')) {
    pciMenu.push({
      id: 'identity-security-legacy',
      title: 'Identity, Security & Operations',
      subItems: [
        {
          id: 'key-management-service',
          title: 'Key Management Service',
          href: getURL('key-management-service', `/`),
        },
      ],
    });
  }

  if (isFeaturesAvailable('okms')) {
    pciMenu.push({
      id: 'identity-security',
      title: 'Identity, Security & Operations',
      subItems: [
        isFeaturesAvailable('okms:key-management-service') && {
          id: 'key-management-service',
          title: 'Key Management Service',
          href: getURL('okms', `#/key-management-service`),
        },
        isFeaturesAvailable('okms:secret-manager') && {
          id: 'okms-secret-manager',
          title: 'Secret Manager',
          badge: 'beta',
          href: getURL('okms', `#/secret-manager`),
        },
      ],
    });
  }

  if (
    isFeaturesAvailable(
      'public-cloud:users',
      'public-cloud:quota',
      'public-cloud:ssh-keys',
      'public-cloud:billing',
      'public-cloud:vouchers',
      'public-cloud:contacts',
      'public-cloud:project-settings',
      'pci-savings-plan',
    )
  ) {
    pciMenu.push({
      id: 'project',
      title: 'Project Management',
      subItems: [
        isFeaturesAvailable('public-cloud:users') && {
          id: 'users',
          title: 'Users & Roles',
          href: getURL('public-cloud', `#/pci/projects/${projectId}/users`),
        },
        isFeaturesAvailable('public-cloud:quota') && {
          id: 'quota',
          title: 'Quota and Regions',
          href: getURL('public-cloud', `#/pci/projects/${projectId}/quota`),
        },
        isFeaturesAvailable('public-cloud:ssh-keys') && {
          id: 'ssh-keys',
          title: 'SSH Keys',
          href: getURL('public-cloud', `#/pci/projects/${projectId}/ssh`),
        },
        isFeaturesAvailable('public-cloud:billing') && {
          id: 'billing',
          title: 'Billing Control',
          href: getURL('public-cloud', `#/pci/projects/${projectId}/billing`),
        },
        isFeaturesAvailable('public-cloud:vouchers') && {
          id: 'vouchers',
          title: 'Credit and Vouchers',
          href: getURL('public-cloud', `#/pci/projects/${projectId}/vouchers`),
        },
        isFeaturesAvailable('pci-savings-plan') && {
          id: 'savings',
          title: 'Savings Plans',
          badge: 'new',
          href: getURL(
            'public-cloud',
            `#/pci/projects/${projectId}/savings-plan`,
          ),
        },
        isFeaturesAvailable('public-cloud:contacts') && {
          id: 'contacts',
          title: 'Contacts and Rights',
          href: getURL('public-cloud', `#/pci/projects/${projectId}/contacts`),
        },
        isFeaturesAvailable('public-cloud:project-settings') && {
          id: 'management-settings',
          title: 'Project settings',
          href: getURL('public-cloud', `#/pci/projects/${projectId}/edit`),
        },
      ],
    });
  }

  return pciMenu;
}
