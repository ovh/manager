export const DEFAULT_PROJECT_KEY = 'PUBLIC_CLOUD_DEFAULT_PROJECT';

const redirectBasePath = '/pci/projects/{project}';

/**
 * @type {import('./index.links').Link[]}
 */
export const LINKS = [
  {
    public: {
      application: 'public-cloud',
      path: '/create-instance',
    },
    redirect: {
      application: 'public-cloud',
      path: `${redirectBasePath}/instances/new`,
    },
  },
  {
    public: {
      application: 'public-cloud',
      path: '/create-block-storage',
    },
    redirect: {
      application: 'public-cloud',
      path: `${redirectBasePath}/storages/blocks/new`,
    },
  },
  {
    public: {
      application: 'public-cloud',
      path: '/create-object-storage',
    },
    redirect: {
      application: 'public-cloud',
      path: `${redirectBasePath}/storages/objects/new`,
    },
  },
  {
    public: {
      application: 'public-cloud',
      path: '/create-cold-archive',
    },
    redirect: {
      application: 'public-cloud',
      path: `${redirectBasePath}/storages/cold-archive/new`,
    },
  },
  {
    public: {
      application: 'public-cloud',
      path: '/create-volume-snapshot',
    },
    redirect: {
      application: 'public-cloud',
      path: `${redirectBasePath}/storages/blocks/new?help=snapshot`,
    },
  },
  {
    public: {
      application: 'public-cloud',
      path: '/create-volume-backup',
    },
    redirect: {
      application: 'public-cloud',
      path: `${redirectBasePath}/storages/volume-backup/create`,
    },
  },
  {
    public: {
      application: 'public-cloud',
      path: '/create-instance-backup',
    },
    redirect: {
      application: 'public-cloud',
      path: `${redirectBasePath}/instances/new?help=backup`,
    },
  },
  {
    public: {
      application: 'public-cloud',
      path: '/create-private-network',
    },
    redirect: {
      application: 'public-cloud',
      path: `${redirectBasePath}/private-networks/new`,
    },
  },
  {
    public: {
      application: 'public-cloud',
      path: '/create-load-balancer',
    },
    redirect: {
      application: 'public-cloud',
      path: `${redirectBasePath}/octavia-load-balancer/create`,
    },
  },
  {
    public: {
      application: 'public-cloud',
      path: '/create-floating-ip',
    },
    redirect: {
      application: 'public-cloud',
      path: `${redirectBasePath}/public-ips/order`,
    },
  },
  {
    public: {
      application: 'public-cloud',
      path: '/create-load-gateway',
    },
    redirect: {
      application: 'public-cloud',
      path: `${redirectBasePath}/gateway/new`,
    },
  },
  {
    public: {
      application: 'public-cloud',
      path: '/create-rancher',
    },
    redirect: {
      application: 'public-cloud',
      path: `${redirectBasePath}/rancher/new`,
    },
  },
  {
    public: {
      application: 'public-cloud',
      path: '/create-managed-private-registry',
    },
    redirect: {
      application: 'public-cloud',
      path: `${redirectBasePath}/private-registry/create`,
    },
  },
  {
    public: {
      application: 'public-cloud',
      path: '/create-managed-kubernetes-service',
    },
    redirect: {
      application: 'public-cloud',
      path: `${redirectBasePath}/kubernetes/new`,
    },
  },
  {
    public: {
      application: 'public-cloud',
      path: '/create-managed-kubernetes-load-balancer',
    },
    redirect: {
      application: 'public-cloud',
      path: `${redirectBasePath}/load-balancer/onboarding`,
    },
  },
  {
    public: {
      application: 'public-cloud',
      path: '/create-database',
    },
    redirect: {
      application: 'public-cloud',
      path: `${redirectBasePath}/storages/databases-analytics/databases/new`,
    },
  },
  {
    public: {
      application: 'public-cloud',
      path: '/create-data-analysis',
    },
    redirect: {
      application: 'public-cloud',
      path: `${redirectBasePath}/storages/databases-analytics/data-analysis/new`,
    },
  },
  {
    public: {
      application: 'public-cloud',
      path: '/create-logs-data-platform',
    },
    redirect: {
      application: 'dedicated',
      path: '/dbaas/logs/order',
    },
  },
  {
    public: {
      application: 'public-cloud',
      path: '/create-ai-notebook',
    },
    redirect: {
      application: 'public-cloud',
      path: `${redirectBasePath}/notebooks/new`,
    },
  },
  {
    public: {
      application: 'public-cloud',
      path: '/create-ai-training',
    },
    redirect: {
      application: 'public-cloud',
      path: `${redirectBasePath}/training/jobs/submit`,
    },
  },
  {
    public: {
      application: 'public-cloud',
      path: '/create-ai-app',
    },
    redirect: {
      application: 'public-cloud',
      path: `${redirectBasePath}/ai/apps/new`,
    },
  },
];

export default {
  DEFAULT_PROJECT_KEY,
};
