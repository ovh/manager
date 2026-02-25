import React from 'react';
import { render } from '@/common/utils/test.provider';
import { describe, expect, Mock, vi } from 'vitest';
import {
  useGetDomainResource,
  useGetDomainZone,
} from '@/domain/hooks/data/query';
import AnycastOrder from './anycastOrder';
import { wrapper } from '@/common/utils/test.provider';
import { serviceInfoDetail } from '@/domain/__mocks__/serviceInfoDetail';

vi.mock('@/domain/hooks/data/query', () => ({
  useGetDomainZone: vi.fn(),
  useGetDomainResource: vi.fn(),
}));

vi.mock('@/domain/components/AnycastOrder/AnycastOrder', () => ({
  default: () => (
    <div data-testid="anycast-order-component">Anycast Order Component</div>
  ),
}));

describe('Anycast Order Page', () => {
  it('Render Anycast order page loading', async () => {
    (useGetDomainZone as Mock).mockReturnValue({
      domainZone: {},
      isFetchingDomainZone: true,
    });
    (useGetDomainResource as Mock).mockReturnValue({
      domainResource: {},
      isFetchingDomainResource: true,
    });
    const { getByTestId, container } = render(<AnycastOrder />, {
      wrapper,
    });
    expect(getByTestId('listing-page-spinner')).toBeInTheDocument();
    await expect(container).toBeAccessible({
      rules: {
        'heading-order': { enabled: false },
      },
    });
  });

  it('Render Anycast order page', async () => {
    (useGetDomainZone as Mock).mockReturnValue({
      domainZone: {},
      isFetchingDomainZone: false,
    });
    (useGetDomainResource as Mock).mockReturnValue({
      domainResource: serviceInfoDetail,
      isFetchingDomainResource: false,
    });
    const { getByTestId, container } = render(<AnycastOrder />, {
      wrapper,
    });
    expect(getByTestId('order-component')).toBeInTheDocument();
    await expect(container).toBeAccessible({
      rules: { 'heading-order': { enabled: false } },
    });
  });
});
