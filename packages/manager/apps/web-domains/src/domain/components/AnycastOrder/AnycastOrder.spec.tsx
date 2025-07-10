import '@/domain/setupTests';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { OvhSubsidiary } from '@ovh-ux/manager-react-components';
import { wrapper } from '@/domain/utils/test.provider';
import AnycastOrderComponent from './AnycastOrder';
import { useGetOrderCatalogDns } from '@/domain/hooks/data/query';
import { DnsCatalogOrderMock } from '@/domain/__mocks__/dnsOrderCatalog';

vi.mock('@/domain/hooks/data/query', () => ({
  useGetOrderCatalogDns: vi.fn(),
}));

describe('Anycast Order component', () => {
  it('Render Anycast order component loading', () => {
    (useGetOrderCatalogDns as jest.Mock).mockReturnValue({
      dnsCatalog: {},
      isFetchingDnsCatalog: true,
    });
    const { getByTestId } = render(
      <AnycastOrderComponent
        displayTitle={false}
        subsidiary={OvhSubsidiary.FR}
        userLocal={'fr_FR'}
      />,
      { wrapper },
    );
    expect(getByTestId('listing-page-spinner')).toBeInTheDocument();
  });

  it('Render Anycast order component without title', () => {
    (useGetOrderCatalogDns as jest.Mock).mockReturnValue({
      dnsCatalog: DnsCatalogOrderMock,
      isFetchingDnsCatalog: false,
    });
    const { getByTestId } = render(
      <AnycastOrderComponent
        displayTitle={false}
        subsidiary={OvhSubsidiary.FR}
        userLocal={'fr_FR'}
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

  it('Render Anycast order component with title', () => {
    (useGetOrderCatalogDns as jest.Mock).mockReturnValue({
      dnsCatalog: DnsCatalogOrderMock,
      isFetchingDnsCatalog: false,
    });
    const { getByTestId } = render(
      <AnycastOrderComponent
        displayTitle={true}
        subsidiary={OvhSubsidiary.FR}
        userLocal={'fr_FR'}
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
