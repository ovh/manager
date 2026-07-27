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
} as const;
