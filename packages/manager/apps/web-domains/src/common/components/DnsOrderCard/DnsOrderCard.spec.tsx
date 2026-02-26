import '@/common/setupTests';
import { render, screen, wrapper } from '@/common/utils/test.provider';
import { Mock, vi } from 'vitest';
import { OvhSubsidiary } from '@ovh-ux/manager-react-components';
import DnsOrderCard from './DnsOrderCard';
import { useGetOrderCatalogDns } from '@/domain/hooks/data/query';
import { DnsCatalogOrderMock } from '@/domain/__mocks__/dnsOrderCatalog';

vi.mock('@/domain/hooks/data/query', () => ({
  useGetOrderCatalogDns: vi.fn(),
}));

describe('DnsOrderCard component', () => {
  it('Render DnsOrderCard loading', () => {
    (useGetOrderCatalogDns as Mock).mockReturnValue({
      dnsCatalog: {},
      isFetchingDnsCatalog: true,
    });
    const { getByTestId } = render(
      <DnsOrderCard
        displayTitle={false}
        subsidiary={OvhSubsidiary.FR}
        userLocal={'fr_FR'}
        isZoneActivation={false}
        anycastSelected={false}
        onAnycastCheckBoxChange={vi.fn()}
      />,
      { wrapper },
    );
    expect(getByTestId('listing-page-spinner')).toBeInTheDocument();
  });

  it('Render DnsOrderCard without title', () => {
    (useGetOrderCatalogDns as Mock).mockReturnValue({
      dnsCatalog: DnsCatalogOrderMock,
      isFetchingDnsCatalog: false,
    });
    const { getByTestId } = render(
      <DnsOrderCard
        displayTitle={false}
        subsidiary={OvhSubsidiary.FR}
        userLocal={'fr_FR'}
        isZoneActivation={false}
        anycastSelected={false}
        onAnycastCheckBoxChange={vi.fn()}
      />,
      { wrapper },
    );
    expect(getByTestId('price-card')).toBeInTheDocument();
    expect(getByTestId('checkbox-price-card-control')).toBeInTheDocument();
    expect(getByTestId('checkbox-price-card-control')).toHaveAttribute(
      'data-state',
      'checked',
    );
    expect(getByTestId('checkbox-price-card')).toHaveAttribute(
      'data-disabled',
      '',
    );
    const title = screen.queryByText('domain_tab_DNS_anycast_order');
    expect(title).not.toBeInTheDocument();
  });

  it('Render DnsOrderCard with title', () => {
    (useGetOrderCatalogDns as Mock).mockReturnValue({
      dnsCatalog: DnsCatalogOrderMock,
      isFetchingDnsCatalog: false,
    });
    const { getByTestId } = render(
      <DnsOrderCard
        displayTitle={true}
        subsidiary={OvhSubsidiary.FR}
        userLocal={'fr_FR'}
        isZoneActivation={false}
        anycastSelected={false}
        onAnycastCheckBoxChange={vi.fn()}
      />,
      { wrapper },
    );
    expect(getByTestId('price-card')).toBeInTheDocument();
    expect(getByTestId('checkbox-price-card-control')).toBeInTheDocument();
    expect(getByTestId('checkbox-price-card-control')).toHaveAttribute(
      'data-state',
      'checked',
    );
    expect(getByTestId('checkbox-price-card')).toHaveAttribute(
      'data-disabled',
      '',
    );
    const title = screen.queryByText('domain_tab_DNS_anycast_order');
    expect(title).toBeInTheDocument();
  });
});
