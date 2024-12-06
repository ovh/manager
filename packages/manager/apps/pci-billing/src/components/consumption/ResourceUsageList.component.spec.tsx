import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ResourceUsageList from './ResourceUsageList.component';
import { TResourceUsage, TStorage } from '@/api/hook/useConsumption';

describe('ResourceUsageList', () => {
  const mockResourcesUsage = [
    {
      name: 'ip',
      quantity: {
        unit: 'Hour',
        value: 347,
      },
      totalPrice: 0.8675,
      region: 'region',
    },
    {
      name: 'ip',
      quantity: {
        unit: 'Hour',
        value: 347,
      },
      totalPrice: 0.8675,
      region: 'region',
    },
  ] as TResourceUsage[];

  it('renders the datagrid when resourcesUsage are present', () => {
    render(<ResourceUsageList resourcesUsage={mockResourcesUsage} />);

    const datagrid = screen.getByTestId('datagrid');
    expect(datagrid).toBeTruthy();
  });

  it('renders no data message when no resourcesUsage are present', () => {
    const { getByText } = render(<ResourceUsageList resourcesUsage={[]} />);

    expect(getByText('pci_billing_private_registry_no_entry')).toBeTruthy();
  });
});
