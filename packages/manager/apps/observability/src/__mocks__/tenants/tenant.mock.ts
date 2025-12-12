import { ObservabilityServiceParams } from '@/data/api/observability.props';
import {
  CreateTenantsPayload,
  EditTenantPayload,
  GetTenantPayload,
} from '@/data/api/tenants.props';
import { Tenant } from '@/types/tenants.type';

const tenantsDataset: Tenant[] = [
  {
    id: '1',
    createdAt: '2025-11-21T14:26:14.041Z',
    updatedAt: '2025-11-21T14:26:14.041Z',
    iam: {
      id: '92c16299-3f5b-4ea9-a806-e0464e7bfa31',
      tags: {
        'ovh:ldp:cluster:name': 'sbg159',
        Application: 'Website',
        Compliance: 'PCI-DSS',
        Departement: 'ITOperations',
        Environment: 'Prod',
        Location: 'Europe',
        Owner: 'JohnDoe',
        Project: 'CustomerPortal',
        Region: 'EUR-East',
        Risk: 'Low',
      },
      urn: 'urn:v1:eu:resource:ldp:ldp-sbg-55078',
    },
    currentState: {
      title: 'Tenant 1',
      description: 'Tenant 1 description',
      limits: {
        mimir: {
          compactor_blocks_retention_period: '30d',
          max_global_series_per_user: 300,
        },
      },
      infrastructure: {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        location: 'eu-west-sbg',
        entryPoint: 'sbg1.metrics.ovh.com',
        type: 'SHARED',
      },
    },
  },
  {
    id: '2',
    createdAt: '2025-11-20T14:26:14.041Z',
    updatedAt: '2025-11-20T14:26:14.041Z',
    iam: {
      id: '92c16299-3f5b-4ea9-a806-e0464e7bfa32',
      tags: {
        'ovh:ldp:cluster:name': 'gra159',
      },
      urn: 'urn:v1:eu:resource:ldp:ldp-gr-55078',
    },
    currentState: {
      title: 'Tenant 2',
      description: 'Tenant 2 description',
      limits: {
        mimir: {
          compactor_blocks_retention_period: '90d',
          max_global_series_per_user: 50,
        },
      },
      infrastructure: {
        id: '6ee8fb35-2621-4530-a288-84fc0e85dac1',
        entryPoint: 'gra1.metrics.ovh.com',
        location: 'eu-west-gra',
        type: 'SHARED',
      },
    },
  },
];

export const getTenants = async ({
  resourceName,
}: ObservabilityServiceParams): Promise<Tenant[]> => {
  const isOnboarding = resourceName !== 'ldp-rg-93836'; // '[DO NOT TOUCH] Monito service'
  console.info(
    `[MOCK-ADAPTER][getTenants] is onboarding mock for ${resourceName} -> `,
    isOnboarding,
  );
  return Promise.resolve(!isOnboarding ? tenantsDataset : []);
};

export const getTenant = async ({ resourceName, tenantId }: GetTenantPayload): Promise<Tenant> => {
  const isOnboarding = resourceName !== 'ldp-rg-93836'; // '[DO NOT TOUCH] Monito service'
  console.info(
    `[MOCK-ADAPTER][getTenants] is onboarding mock for ${resourceName} -> `,
    isOnboarding,
  );

  const tenant = tenantsDataset.find((t) => t.id === tenantId);

  if (!tenant) {
    throw new Error(`[MOCK-ADAPTER][getTenant] Tenant with id "${tenantId}" not found`);
  }

  return Promise.resolve(tenant);
};

export const deleteTenant = async ({
  resourceName,
  tenantId,
}: GetTenantPayload): Promise<Tenant> => {
  console.info(`[MOCK-ADAPTER][deleteTenant] mock deletion of tenant for ${resourceName}`);
  console.info(`[MOCK-ADAPTER][deleteTenant] tenantId ->`, tenantId);

  let tenant = tenantsDataset.find((t) => t.id === tenantId);

  if (!tenant) {
    throw new Error(`[MOCK-ADAPTER][deleteTenant] Tenant with id "${tenantId}" not found`);
  }

  return Promise.resolve(tenant);
};

export const createTenant = async function ({
  resourceName,
  targetSpec,
}: CreateTenantsPayload): Promise<Tenant> {
  console.info(`[MOCK-ADAPTER][createTenant] mock creation of tenant for ${resourceName}`);
  console.info(`[MOCK-ADAPTER][createTenant] targetSpec -> `, targetSpec);
  return Promise.resolve(tenantsDataset[0]!);
};

export const editTenant = async ({
  resourceName,
  tenantId,
  targetSpec,
}: EditTenantPayload): Promise<Tenant> => {
  console.info(`[MOCK-ADAPTER][editTenant] mock editing of tenant for ${resourceName}`);
  console.info(`[MOCK-ADAPTER][editTenant] tenantId ->`, tenantId);
  console.info(`[MOCK-ADAPTER][editTenant] targetSpec ->`, targetSpec);
  return Promise.resolve(tenantsDataset[0]!);
};
