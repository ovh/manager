import { render, screen } from '@testing-library/react';
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

  it('renders the datagrid when storages are present', () => {
    render(<ArchiveStorageList storages={mockStorages} />);

    const datagrid = screen.getByTestId('datagrid');
    expect(datagrid).toBeTruthy();
  });

  it('renders no data message when no storages are present', () => {
    const { getByText } = render(<ArchiveStorageList storages={[]} />);

    expect(getByText('cpbc_no_consumption_data')).toBeTruthy();
  });
});
