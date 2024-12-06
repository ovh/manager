import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TSnapshot } from '@/api/hook/useConsumption';
import SnapshotList from './SnapshotList.component';

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

  it('matches snapshot', () => {
    const { asFragment } = render(<SnapshotList snapshots={mockSnapshots} />);

    expect(asFragment()).toMatchSnapshot();
  });
});
