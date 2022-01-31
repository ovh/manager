export default {
  children: [
    {
      id: 'home',
      label: 'Tableau de bord',
      path: '/manager',
    },
    {
      id: 'services',
      label: 'Mes services',
      count: ({ reket }) =>
        reket.get('/services').then((result) => result.length),
      children: [
        {
          id: 'dedicated',
          label: 'Serveurs dédiés et virtuels',
          count: ({ reket }) =>
            reket
              .get('/services?routes=/dedicated/server,/vps')
              .then((result) => result.length),
          children: [
            {
              id: 'dedicated-servers',
              label: 'Serveur dédiés',
              count: ({ reket }) =>
                reket
                  .get('/services?routes=/dedicated/server')
                  .then((result) => result.length),
            },
            {
              id: 'vps',
              label: 'Serveur privés virtuels',
              count: ({ reket }) =>
                reket
                  .get('/services?routes=/vps')
                  .then((result) => result.length),
            },
            {
              id: 'managed-bare-metal',
              label: 'Managed Bare Metal',
            },
            {
              id: 'dedicated-licences',
              label: 'Licences',
            },
          ],
        },
        {
          id: 'hosted-private-cloud',
          label: 'Hosted Private Cloud',
          count: ({ reket }) =>
            reket
              .get('/services?routes=/dedicatedCloud')
              .then((result) => result.length),
          children: [
            {
              id: 'vm-ware',
              label: 'VMware',
            },
            {
              id: 'anthos',
              label: 'Anthos',
            },
            {
              id: 'veeam-enterprise',
              label: 'Veeam Enterprise',
            },
          ],
        },
        {
          id: 'public-cloud',
          label: 'Public Cloud',
          count: ({ reket }) =>
            reket
              .get('/services?routes=/cloud/project/{serviceName}')
              .then((result) => result.length),
          children: [
            {
              id: 'pci-compute',
              label: 'Compute',
              children: [
                {
                  id: 'pci-instances',
                  label: 'Instances',
                },
                {
                  id: 'pci-bare-metal',
                  label: 'Bare Metal',
                },
              ],
            },
            {
              id: 'pci-storage',
              label: 'Storage',
            },
            {
              id: 'pci-network',
              label: 'Network',
            },
            {
              id: 'pci-containers',
              label: 'Containers & Orchestration',
            },
            {
              id: 'pci-ai',
              label: 'AI & Machine Learning',
            },
            {
              id: 'pci-analytics',
              label: 'Data & Analytics',
            },
            {
              id: 'pci-management-interface',
              label: 'Management Interface',
            },
            {
              id: 'pci-projects',
              label: 'Project Management',
            },
          ],
        },
        {
          id: 'storage',
          label: 'Services de stockage',
          children: [
            {
              id: 'nasha',
              label: 'NasHA',
            },
            {
              id: 'netapp',
              label: 'NetApp',
            },
            {
              id: 'cloud-disk-array',
              label: 'Cloud Disk Array',
            },
            {
              id: 'veeam-cloud-connect',
              label: 'Veeam Cloud Connect',
            },
          ],
        },
        {
          id: 'databases',
          label: 'Databases',
          children: [
            {
              id: 'enterprise-file-storage',
              label: 'Enterprise file storage',
            },
            {
              id: 'metrics-data-platform',
              label: 'Metrics Data Platform',
            },
            {
              id: 'logs-data-platform',
              label: 'Logs Data Platform',
            },
            {
              id: 'enterprise-cloud-db',
              label: 'Enterprise Cloud Databases',
            },
          ],
        },
        {
          id: 'network-security',
          label: 'Réseau et sécurité',
          children: [
            {
              id: 'vrack',
              label: 'vRack',
            },
            {
              id: 'ovhcloud-connect',
              label: 'OVHcloud connect',
            },
            {
              id: 'iplb',
              label: 'IP Load Balancer',
            },
            {
              id: 'ip',
              label: 'IP',
            },
            {
              id: 'cdn',
              label: 'CDN Infrastructure',
            },
          ],
        },
        {
          id: 'domain-dns',
          label: 'Domaines et DNS',
          children: [
            {
              id: 'domains',
              label: 'Domains',
            },
            {
              id: 'dns',
              label: 'Zone DNS',
            },
          ],
        },
        {
          id: 'web-hosting',
          label: 'Hébergement Web',
          children: [
            {
              id: 'hosting',
              label: 'Hébergements',
            },
            {
              id: 'cloud-web',
              label: 'Cloud Web',
            },
            {
              id: 'plesk',
              label: 'Plesk',
            },
            {
              id: 'web-databases',
              label: 'Base de données',
            },
          ],
        },
        {
          id: 'web-paas',
          label: 'Web PaaS',
          children: [
            {
              id: 'platform-sh',
              label: 'Platform.sh',
            },
          ],
        },
        {
          id: 'emails',
          label: 'Email Pro',
          children: [
            {
              id: 'email-pro',
              label: 'Email Pro',
            },
            {
              id: 'exchange',
              label: 'Exchange',
            },
            {
              id: 'mxplan',
              label: 'MXPlan',
            },
          ],
        },
        {
          id: 'tools',
          label: 'Outils collaboratifs',
          children: [
            {
              id: 'office',
              label: 'Office',
            },
            {
              id: 'sharepoint',
              label: 'Sharepoint',
            },
          ],
        },
        {
          id: 'internet',
          label: 'Internet',
          children: [
            {
              id: 'packs',
              label: 'Packs',
            },
            {
              id: 'line',
              label: 'Ligne internet seule',
            },
            {
              id: 'otb',
              label: 'Over The Box',
            },
          ],
        },
      ],
    },
    {
      id: 'account',
      label: 'Mon compte',
    },
    {
      id: 'billing',
      label: 'Mes factures',
    },
    {
      id: 'orders',
      label: 'Mes commandes',
    },
    {
      id: 'sunrise',
      label: 'Sunrise',
    },
    {
      id: 'marketplace',
      label: 'Marketplace',
    },
  ],
};
