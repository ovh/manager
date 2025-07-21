import '@/domain/setupTests';
import { useGetDomainZone } from '@/domain/hooks/data/query';
import { render } from '@testing-library/react';
import { describe, expect, vi } from 'vitest';
import AnycastOrder from './anycastOrder';
import React from 'react';
import { wrapper } from '@/domain/utils/test.provider';

vi.mock('@/domain/hooks/data/query', () => ({
  useGetDomainZone: vi.fn(),
}));

vi.mock('@/domain/components/AnycastOrder/AnycastOrder', () => ({
  default: () => <div>Anycast Order Component</div>,
}));

describe('Anycast Order Page', () => {
  it('Render Anycast order page loading', () => {
    (useGetDomainZone as jest.Mock).mockReturnValue({
      domainZone: {},
      isFetchingdomainZone: true,
    });
    const { getByTestId } = render(<AnycastOrder />, {
      wrapper,
    });
    expect(getByTestId('listing-page-spinner')).toBeInTheDocument();
  });

  it('Render Anycast order page', () => {
    (useGetDomainZone as jest.Mock).mockReturnValue({
      domainZone: {},
      isFetchingdomainZone: false,
    });
    const { getByTestId } = render(<AnycastOrder />, {
      wrapper,
    });
    expect(getByTestId('order-component')).toBeInTheDocument();
  });
});
