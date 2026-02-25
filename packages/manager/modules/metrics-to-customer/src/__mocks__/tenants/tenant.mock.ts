import { getDataset } from '@/__datasets__/datasetsUtils';
import { ObservabilityServiceParams } from '@/data/api/observability.props';
import {
  CreateTenantsPayload,
  DeleteTenantSubscriptionPayload,
  EditTenantPayload,
  GetTenantPayload,
} from '@/data/api/tenants.props';
import { Tenant, TenantSubscription } from '@/types/tenants.type';

const tenantsDataset: Tenant[] = getDataset<Tenant[]>('tenants', 'ldp-rg-93836') as Tenant[];

const tenantSubscriptionsDataset: TenantSubscription[] = getDataset<TenantSubscription[]>('tenantSubscriptions', 'subscriptions') as TenantSubscription[];

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

export const getTenantSubscriptions = async ({
  resourceName,
  tenantId,
}: GetTenantPayload): Promise<TenantSubscription[]> => {
  console.info(
    `[MOCK-ADAPTER][getTenantSubscriptions] mock fetching of tenant subscriptions for ${resourceName}`,
  );
  console.info(`[MOCK-ADAPTER][getTenantSubscriptions] tenantId ->`, tenantId);
  return Promise.resolve(tenantSubscriptionsDataset);
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

export const deleteTenantSubscription = async ({
  resourceName,
  tenantId,
  subscriptionId,
}: DeleteTenantSubscriptionPayload): Promise<TenantSubscription> => {
  console.info(
    `[MOCK-ADAPTER][deleteTenantSubscription] mock deletion of tenant subscription for ${resourceName}`,
  );
  console.info(`[MOCK-ADAPTER][deleteTenantSubscription] tenantId ->`, tenantId);
  console.info(`[MOCK-ADAPTER][deleteTenantSubscription] subscriptionId ->`, subscriptionId);
  return Promise.resolve({
    id: '2',
    createdAt: '2025-11-21T14:26:14.041Z',
    updatedAt: '2025-11-21T14:26:14.041Z',
    resourceStatus: 'READY',
    iam: {
      id: tenantId,
      tags: {
        environment: 'Dev',
      },
      urn: `urn:v1:eu:resource:ldp:${resourceName}`,
    },
    currentState: {
      kind: 'Subscription',
      link: `https://api.ovh.com/v2/observability/resource/${resourceName}/metric/tenant/${tenantId}/subscription`,
      resource: { name: `${resourceName}-${tenantId}-subscription-2`, type: 'PCI/Instance' },
    },
  });
};
