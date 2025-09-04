import '@/common/setupTests';
import React from 'react';
import { render } from '@testing-library/react';
import { vi } from 'vitest';
import { wrapper } from '@/common/utils/test.provider';
import DnsZoneOrder from './DnsZoneOrder';

describe('DnsZone Order component', () => {
  it('Render DNS Zone order component with supported DNSSEC', () => {
    const { getByTestId, getAllByTestId } = render(
      <DnsZoneOrder
        dnssecSelected={true}
        onDnssecSelectedChange={vi.fn()}
        dnssecSupported={true}
      />,
      { wrapper },
    );
    const checkbox = getAllByTestId('checkbox-price-card');
    expect(getByTestId('dnsZone-order')).toBeInTheDocument();
    expect(getByTestId('dns-warning-message')).toBeInTheDocument();
    expect(checkbox.length).toBe(2);
    checkbox.forEach((check) =>
      expect(check).toHaveAttribute('data-state', 'checked'),
    );
    expect(getAllByTestId('price-card').length).toBe(2);
  });

  it('Render DNS Zone order component without supported DNSSEC', () => {
    const { getByTestId, getAllByTestId } = render(
      <DnsZoneOrder
        dnssecSelected={false}
        onDnssecSelectedChange={vi.fn()}
        dnssecSupported={false}
      />,
      { wrapper },
    );
    expect(getByTestId('dnsZone-order')).toBeInTheDocument();
    expect(getByTestId('dns-warning-message')).toBeInTheDocument();
    expect(getAllByTestId('price-card').length).toBe(1);
  });
});
