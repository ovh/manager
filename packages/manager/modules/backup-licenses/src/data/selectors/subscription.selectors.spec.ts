import { describe, expect, it } from 'vitest';

import { buildBackupLicensesVspcTenant } from '@/mocks/tenants/tenants.mock';
import { Resource } from '@/types/Resource.type';
import { SubscriptionStatus } from '@/types/Subscription.type';
import { VspcTenant } from '@/types/VspcTenant.type';

import { selectSubscriptionStatus } from './subscription.selectors';

const tenant = (id: string, resourceStatus: Resource<VspcTenant>['resourceStatus']) => ({
  ...buildBackupLicensesVspcTenant(id),
  resourceStatus,
});

const otherProductTenant = (id: string): Resource<VspcTenant> => ({
  ...buildBackupLicensesVspcTenant(id),
  currentState: { id, vspcType: 'BASIC', enabledAddons: ['BACKUP_AGENT'] },
});

describe('selectSubscriptionStatus', () => {
  it('reports no subscription when the account holds no Backup Licenses tenant', () => {
    expect(selectSubscriptionStatus([[]])).toBe(SubscriptionStatus.NONE);
  });

  it('ignores the tenants of the other products sharing the same route', () => {
    expect(selectSubscriptionStatus([[otherProductTenant('other-1')]])).toBe(
      SubscriptionStatus.NONE,
    );
  });

  it('reports a ready subscription as soon as one tenant is delivered', () => {
    expect(selectSubscriptionStatus([[tenant('a', 'CREATING'), tenant('b', 'READY')]])).toBe(
      SubscriptionStatus.READY,
    );
  });

  it('reports a delivery in progress while the tenant is being created', () => {
    expect(selectSubscriptionStatus([[tenant('a', 'CREATING')]])).toBe(SubscriptionStatus.PENDING);
  });

  it('reports the failure when every tenant of the product is in error', () => {
    expect(selectSubscriptionStatus([[tenant('a', 'ERROR')]])).toBe(SubscriptionStatus.ERROR);
  });

  it('still counts the delivery as running when only one of the tenants failed', () => {
    expect(selectSubscriptionStatus([[tenant('a', 'ERROR')], [tenant('b', 'UPDATING')]])).toBe(
      SubscriptionStatus.PENDING,
    );
  });
});
