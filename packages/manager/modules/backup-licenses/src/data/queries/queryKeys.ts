export const queryKeys = {
  subscription: {
    active: () => ['backup-licenses', 'subscription', 'active'],
  },
  backupServices: {
    tenants: () => ['backup-licenses', 'backup-services', 'tenants'],
  },
  vspc: {
    tenants: (backupServicesId: string) => ['backup-licenses', 'vspc', 'tenants', backupServicesId],
  },
  /** Ids résolus de la cascade (service + tenant VSPC), consommés par la page de service. */
  serviceIds: () => ['backup-licenses', 'service-ids'],
  backupServers: {
    all: () => ['backup-licenses', 'backup-servers'],
  },
  backupLicense: {
    all: () => ['backup-licenses', 'backup-license'],
    resourceName: () => ['backup-licenses', 'backup-license', 'resource-name'],
  },
  billing: {
    all: () => ['backup-licenses', 'billing'],
    consumptionRows: () => [...queryKeys.billing.all(), 'consumption-rows'],
  },
  vaults: {
    all: () => ['backup-licenses', 'vaults'],
    /** Commandes acceptées mais pas encore visibles dans `all()` : cache géré côté client uniquement. */
    pending: () => [...queryKeys.vaults.all(), 'pending'],
    bucketCredentials: (vaultId: string, bucketId: string) => [
      ...queryKeys.vaults.all(),
      vaultId,
      'bucket',
      bucketId,
      'credentials',
    ],
  },
  catalog: {
    backupServices: (ovhSubsidiary: string) => [
      'backup-licenses',
      'catalog',
      'backup-services',
      ovhSubsidiary,
    ],
  },
  order: {
    serviceOffers: (serviceName: string) => [
      'backup-licenses',
      'order',
      'service-offers',
      serviceName,
    ],
  },
} as const;
