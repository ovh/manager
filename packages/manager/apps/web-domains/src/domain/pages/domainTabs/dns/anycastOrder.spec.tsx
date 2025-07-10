import '@/domain/setupTests';
import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, vi } from 'vitest';
import {
  useGetDomainResource,
  useGetDomainZone,
} from '@/domain/hooks/data/query';
import AnycastOrder from './anycastOrder';
import { wrapper } from '@/domain/utils/test.provider';
import { serviceInfoDetail } from '@/domain/__mocks__/serviceInfoDetail';

vi.mock('@/domain/hooks/data/query', () => ({
  useGetDomainZone: vi.fn(),
  useGetDomainResource: vi.fn(),
}));

vi.mock('@/domain/components/AnycastOrder/AnycastOrder', () => ({
  default: () => <div>Anycast Order Component</div>,
}));

describe('Anycast Order Page', () => {
  it('Render Anycast order page loading', () => {
    (useGetDomainZone as jest.Mock).mockReturnValue({
      domainZone: {},
      isFetchingDomainZone: true,
    });
    (useGetDomainResource as jest.Mock).mockReturnValue({
      domainResource: {},
      isFetchingDomainZone: true,
    });
    const { getByTestId } = render(<AnycastOrder />, {
      wrapper,
    });
    expect(getByTestId('listing-page-spinner')).toBeInTheDocument();
  });

  it('Render Anycast order page', () => {
    (useGetDomainZone as jest.Mock).mockReturnValue({
      domainZone: {},
      isFetchingDomainZone: false,
    });
    (useGetDomainResource as jest.Mock).mockReturnValue({
      domainResource: serviceInfoDetail,
      isFetchingDomainZone: false,
    });
    const { getByTestId } = render(<AnycastOrder />, {
      wrapper,
    });
    expect(getByTestId('order-component')).toBeInTheDocument();
  });
});
