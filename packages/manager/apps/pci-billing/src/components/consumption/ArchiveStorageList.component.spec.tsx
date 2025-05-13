import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ArchiveStorageList from './ArchiveStorageList.component';
import { TStorage } from '@/api/hook/useConsumption';

describe('ArchiveStorageList', () => {
  const mockStorages = [
    {
      region: 'GRA',
      stored: {
        totalPrice: 10.5,
        quantity: { value: 100 },
      },
      incomingBandwidth: {
        totalPrice: 5.25,
        quantity: { value: 50 },
      },
      outgoingBandwidth: {
        totalPrice: 7.75,
        quantity: { value: 75 },
      },
    },
    {
      region: 'BHS',
      stored: {
        totalPrice: 15.75,
        quantity: { value: 150 },
      },
      incomingBandwidth: {
        totalPrice: 6.5,
        quantity: { value: 60 },
      },
      outgoingBandwidth: {
        totalPrice: 8.25,
        quantity: { value: 80 },
      },
    },
  ] as TStorage[];

  it('matches snapshot with existing storages', () => {
    const { asFragment } = render(
      <ArchiveStorageList storages={mockStorages} />,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('matches snapshot with empty storages', () => {
    const { asFragment } = render(<ArchiveStorageList storages={[]} />);

    expect(asFragment()).toMatchSnapshot();
  });
});
