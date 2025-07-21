import '@/domain/setupTests';
import React from 'react';
import { render } from '@testing-library/react';
import { vi } from 'vitest';
import { wrapper } from '@/domain/utils/test.provider';
import DnsZoneOrder from './DnsZoneOrder';

describe('DnsZone Order component', () => {
  it('Render DNS Zone order component with supported DNSSEC', () => {
    const { getByTestId, getAllByTestId } = render(
      <DnsZoneOrder dnssecSelected={true} setDnssecSelected={vi.fn()} />,
      { wrapper },
    );
    const checkbox = getAllByTestId('checkbox-price-card')
    expect(getByTestId('dnsZone-order')).toBeInTheDocument();
    expect(getByTestId('dns-warning-message')).toBeInTheDocument();
    expect(checkbox.length).toBe(2);
    checkbox.forEach((check) => expect(check).toHaveAttribute('data-state', 'checked'));
    expect(getAllByTestId('price-card').length).toBe(2);
  });

  /*it('Render DNS Zone order component without supported DNSSEC', () => {
    const { getByTestId, getAllByTestId } = render(
      <DnsZoneOrder dnssecSelected={false} setDnssecSelected={vi.fn()} />,
      { wrapper },
    );
    expect(getByTestId('dnsZone-order')).toBeInTheDocument();
    expect(getByTestId('dns-warning-message')).toBeInTheDocument();
    expect(getAllByTestId('price-card').length).toBe(1);
  });*/
});
