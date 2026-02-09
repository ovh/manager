export const queryKeys = {
  backupServices: {
    all: ['backupServices'],
  },
  tenants: {
    all: ['backup', 'tenants'],
    details: () => [...queryKeys.tenants.all, 'details'],
    vspc: {
      all: () => [...queryKeys.tenants.all, 'vspc'],
      detail: (vspcTenantId?: string) => [...queryKeys.tenants.vspc.all(), vspcTenantId],
      policies: () => [...queryKeys.tenants.vspc.detail(), 'policies'],
    },
  },
  vaults: {
    all: ['backup', 'vaults'],
    detail: (vaultId?: string) => [...queryKeys.vaults.all, 'details', vaultId],
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
