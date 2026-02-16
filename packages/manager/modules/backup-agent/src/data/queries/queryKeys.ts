export const queryKeys = {
  backupServices: {
    all: ['backupServices'],
  },
  tenants: {
    all: ['backup', 'tenants'],
    detail: () => [...queryKeys.tenants.all, 'detail'],
    vspc: {
      all: () => [...queryKeys.tenants.all, 'vspc'],
      detail: () => [...queryKeys.tenants.vspc.all(), 'detail'],
      policies: () => [...queryKeys.tenants.vspc.detail(), 'policies'],
    },
  },
  vaults: {
    all: ['backup', 'vaults'],
    detail: (vaultId?: string) => [...queryKeys.vaults.all, 'detail', vaultId],
  },
  agents: {
    all: () => [...queryKeys.tenants.vspc.detail(), 'agents'],
    detail: (agentId: string) => [...queryKeys.tenants.vspc.detail(), agentId],
    downloadLink: () => [...queryKeys.tenants.vspc.detail(), 'agent'],
  },
  locations: {
    all: ['location'],
    detail: (locationName: string) => [...queryKeys.locations.all, locationName],
  },
  baremetals: {
    all: ['baremetals'],
    detail: (serviceName: string) => [...queryKeys.baremetals.all, serviceName],
  },
  consumption: {
    all: ['services', 'consumption'],
    byResource: (resourceName: string) => [...queryKeys.consumption.all, resourceName],
  },
} as const;
