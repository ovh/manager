import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ColdArchiveList from './ColdArchiveList.component';

describe('ColdArchiveList', () => {
  const mockColdArchives = [
    {
      name: 'archive',
      quantity: {
        value: 0,
        unit: 'Hour',
      },
      totalPrice: 0,
      region: 'RBX-ARCHIVE',
    },
    {
      name: 'restore',
      quantity: {
        value: 0,
        unit: 'Unit',
      },
      totalPrice: 0,
      region: 'RBX-ARCHIVE',
    },
    {
      name: 'archive-fees',
      quantity: {
        value: 0,
        unit: 'Hour',
      },
      totalPrice: 0,
      region: 'RBX-ARCHIVE',
    },
  ];

  it('renders the datagrid when coldArchives are present', () => {
    render(<ColdArchiveList coldArchives={mockColdArchives} />);

    const datagrid = screen.getByTestId('datagrid');
    expect(datagrid).toBeTruthy();
  });

  it('renders no data message when no coldArchives are present', () => {
    const { getByText } = render(<ColdArchiveList coldArchives={[]} />);

    expect(getByText('pci_billing_cold_archive_no_entry')).toBeTruthy();
  });
});
