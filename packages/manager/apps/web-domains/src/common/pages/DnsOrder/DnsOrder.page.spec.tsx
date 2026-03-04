import { render, wrapper } from '@/common/utils/test.provider';
import { describe, expect, Mock, vi } from 'vitest';
import {
  useGetDomainResource,
  useGetDomainZone,
} from '@/domain/hooks/data/query';
import DnsOrderPage from './DnsOrder.page';
import { serviceInfoDetail } from '@/domain/__mocks__/serviceInfoDetail';

vi.mock('@/domain/hooks/data/query', () => ({
  useGetDomainZone: vi.fn(),
  useGetDomainResource: vi.fn(),
}));

vi.mock('@/common/components/DnsOrderCard/DnsOrderCard', () => ({
  default: () => <div>Dns Order Card Component</div>,
}));

describe('DnsOrderPage', () => {
  it('Render DnsOrderPage loading', () => {
    (useGetDomainZone as Mock).mockReturnValue({
      domainZone: {},
      isFetchingDomainZone: true,
    });
    (useGetDomainResource as Mock).mockReturnValue({
      domainResource: {},
      isFetchingDomainZone: true,
    });
    const { getByTestId } = render(<DnsOrderPage />, {
      wrapper,
    });
    expect(getByTestId('listing-page-spinner')).toBeInTheDocument();
  });

  it('Render DnsOrderPage', () => {
    (useGetDomainZone as Mock).mockReturnValue({
      domainZone: {},
      isFetchingDomainZone: false,
    });
    (useGetDomainResource as Mock).mockReturnValue({
      domainResource: serviceInfoDetail,
      isFetchingDomainZone: false,
    });
    const { getByTestId } = render(<DnsOrderPage />, {
      wrapper,
    });
    expect(getByTestId('order-component')).toBeInTheDocument();
  });
});
