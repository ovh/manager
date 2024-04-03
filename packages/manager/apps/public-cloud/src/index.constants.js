export const DEFAULT_PROJECT_KEY = 'PUBLIC_CLOUD_DEFAULT_PROJECT';

const application = 'public-cloud';
const redirectBasePath = '/pci/projects/{project}';

/**
 * @type {import('./index.links').Link[]}
 */
export const LINKS = [
  /* --------------------------------- COMPUTE -------------------------------- */

  {
    public: {
      application,
      path: '/create-instance',
    },
    redirect: {
      application,
      path: `${redirectBasePath}/instances/new`,
    },
  },
  {
    public: {
      application,
      path: '/create-compute-optimized-instance',
    },
    redirect: {
      application,
      path: `${redirectBasePath}/instances/new?c=cpu`,
    },
  },
  {
    public: {
      application,
      path: '/create-memory-optimized-instance',
    },
    redirect: {
      application,
      path: `${redirectBasePath}/instances/new?c=ram`,
    },
  },
  {
    public: {
      application,
      path: '/create-gpu-instance',
    },
    redirect: {
      application,
      path: `${redirectBasePath}/instances/new?c=accelerated`,
    },
  },
  {
    public: {
      application,
      path: '/create-discovery-instance',
    },
    redirect: {
      application,
      path: `${redirectBasePath}/instances/new?c=discovery`,
    },
  },
  {
    public: {
      application,
      path: '/create-storage-optimized-instance',
    },
    redirect: {
      application,
      path: `${redirectBasePath}/instances/new?c=iops`,
    },
  },
  {
    public: {
      application,
      path: '/create-bare-metal-instance',
    },
    redirect: {
      application,
      path: `${redirectBasePath}/instances/new?c=baremetal`,
    },
  },

  /* --------------------------------- STORAGE -------------------------------- */

  {
    public: {
      application,
      path: '/create-block-storage',
    },
    redirect: {
      application,
      path: `${redirectBasePath}/storages/blocks/new`,
    },
  },
  {
    public: {
      application,
      path: '/create-object-storage',
    },
    redirect: {
      application,
      path: `${redirectBasePath}/storages/objects/new`,
    },
  },
  {
    public: {
      application,
      path: '/create-cold-archive',
    },
    redirect: {
      application,
      path: `${redirectBasePath}/storages/cold-archive/new`,
    },
  },
  {
    public: {
      application,
      path: '/create-volume-snapshot',
    },
    redirect: {
      application,
      path: `${redirectBasePath}/storages/blocks/new?help=snapshot`,
    },
  },
  {
    public: {
      application,
      path: '/create-volume-backup',
    },
    redirect: {
      application,
      path: `${redirectBasePath}/storages/volume-backup/create`,
    },
  },
  {
    public: {
      application,
      path: '/create-instance-backup',
    },
    redirect: {
      application,
      path: `${redirectBasePath}/instances/new?help=backup`,
    },
  },

  /* --------------------------------- NETWORK -------------------------------- */

  {
    public: {
      application,
      path: '/create-private-network',
    },
    redirect: {
      application,
      path: `${redirectBasePath}/private-networks/new`,
    },
  },
  {
    public: {
      application,
      path: '/create-load-balancer',
    },
    redirect: {
      application,
      path: `${redirectBasePath}/octavia-load-balancer/create`,
    },
  },
  {
    public: {
      application,
      path: '/create-floating-ip',
    },
    redirect: {
      application,
      path: `${redirectBasePath}/public-ips/order`,
    },
  },
  {
    public: {
      application,
      path: '/create-gateway',
    },
    redirect: {
      application,
      path: `${redirectBasePath}/gateway/new`,
    },
  },

  /* ------------------------------- CONTAINERS ------------------------------- */

  {
    public: {
      application,
      path: '/create-rancher',
    },
    redirect: {
      application,
      path: `${redirectBasePath}/rancher/new`,
    },
  },
  {
    public: {
      application,
      path: '/create-managed-private-registry',
    },
    redirect: {
      application,
      path: `${redirectBasePath}/private-registry/create`,
    },
  },
  {
    public: {
      application,
      path: '/create-managed-kubernetes-service',
    },
    redirect: {
      application,
      path: `${redirectBasePath}/kubernetes/new`,
    },
  },
  {
    public: {
      application,
      path: '/create-managed-kubernetes-load-balancer',
    },
    redirect: {
      application,
      path: `${redirectBasePath}/load-balancer/onboarding`,
    },
  },

  /* -------------------------------- DATABASES ------------------------------- */

  {
    public: {
      application,
      path: '/create-database',
    },
    redirect: {
      application,
      path: `${redirectBasePath}/storages/databases-analytics/databases/new`,
    },
  },
  {
    public: {
      application,
      path: '/create-data-analysis',
    },
    redirect: {
      application,
      path: `${redirectBasePath}/storages/databases-analytics/data-analysis/new`,
    },
  },
  {
    public: {
      application,
      path: '/create-logs-data-platform',
    },
    redirect: {
      application: 'dedicated',
      path: '/dbaas/logs/order',
    },
  },

  /* ----------------------------------- AI ----------------------------------- */

  {
    public: {
      application,
      path: '/create-ai-notebook',
    },
    redirect: {
      application,
      path: `${redirectBasePath}/notebooks/new`,
    },
  },
  {
    public: {
      application,
      path: '/create-ai-training',
    },
    redirect: {
      application,
      path: `${redirectBasePath}/training/jobs/submit`,
    },
  },
  {
    public: {
      application,
      path: '/create-ai-app',
    },
    redirect: {
      application,
      path: `${redirectBasePath}/ai/apps/new`,
    },
  },
];

export default {
  DEFAULT_PROJECT_KEY,
  LINKS,
};
