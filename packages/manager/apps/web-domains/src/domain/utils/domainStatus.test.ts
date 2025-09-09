import { BADGE_COLOR } from '@ovhcloud/ods-react';
import { StatusDetails } from '@/domain/types/domainResource';
import { domainStatusToBadge } from '@/domain/utils/domainStatus';

describe('domainStatusToBadge', () => {
  const mapping: Record<string, StatusDetails> = {
    active: {
      statusColor: BADGE_COLOR.alpha,
      i18nKey: 'domain.status.active',
    },
    suspended: {
      statusColor: BADGE_COLOR.beta,
      i18nKey: 'domain.status.suspended',
    },
  };

  it('should return the correct StatusDetails for a valid key', () => {
    expect(domainStatusToBadge(mapping, 'active')).toEqual({
      statusColor: BADGE_COLOR.alpha,
      i18nKey: 'domain.status.active',
    });
    expect(domainStatusToBadge(mapping, 'suspended')).toEqual({
      statusColor: BADGE_COLOR.beta,
      i18nKey: 'domain.status.suspended',
    });
  });

  it('should return undefined for an invalid key', () => {
    expect(domainStatusToBadge(mapping, 'unknown')).toBeUndefined();
  });

  it('should be case-sensitive', () => {
    expect(domainStatusToBadge(mapping, 'Active')).toBeUndefined();
    expect(domainStatusToBadge(mapping, 'Suspended')).toBeUndefined();
  });

  it('should return undefined for an empty mapping', () => {
    expect(domainStatusToBadge({}, 'active')).toBeUndefined();
  });
});
