export const tunnelQueryKey = {
  tenants: () => ['tunnel', 'tenants'] as const,
  vspcs: (tenantId: string) => ['tunnel', 'tenant', tenantId, 'vspc'] as const,
  vspcDetail: (tenantId: string, vspcId: string) =>
    ['tunnel', 'tenant', tenantId, 'vspc', vspcId, 'status'] as const,
  managementAgent: (tenantId: string, vspcId: string) =>
    ['tunnel', 'tenant', tenantId, 'vspc', vspcId, 'managementAgent'] as const,
};
