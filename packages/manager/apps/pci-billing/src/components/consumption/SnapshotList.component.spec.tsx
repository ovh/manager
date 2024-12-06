import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import SnapshotList from './SnapshotList.component';
import { TResourceUsage, TSnapshot, TStorage } from '@/api/hook/useConsumption';

describe('SnapshotList', () => {
  const mockSnapshots = [
    {
      instance: {
        quantity: {
          unit: 'GiBh',
          value: 1188.0000019790605,
        },
        totalPrice: 0.0297,
      },
      region: 'region',
      totalPrice: 0.03,
      volume: null,
    },
    {
      instance: {
        quantity: {
          unit: 'GiBh',
          value: 9.164214134e-7,
        },
        totalPrice: 0,
      },
      region: 'region',
      totalPrice: 0,
      volume: null,
    },
  ] as TSnapshot[];

  it('renders the datagrid when snapshots are present', () => {
    render(<SnapshotList snapshots={mockSnapshots} />);

    const datagrid = screen.getByTestId('datagrid');
    expect(datagrid).toBeTruthy();
  });

  it('renders no data message when no snapshots are present', () => {
    const { getByText } = render(<SnapshotList snapshots={[]} />);

    expect(getByText('cpbc_no_consumption_data')).toBeTruthy();
  });
});
