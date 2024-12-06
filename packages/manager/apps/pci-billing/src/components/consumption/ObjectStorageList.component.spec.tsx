import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TStorage } from '@/api/hook/useConsumption';
import ObjectStorageList from './ObjectStorageList.component';

describe('ObjectStorageList', () => {
  const mockStorages = [
    {
      bucketName: 'banner-changing-page',
      incomingBandwidth: {
        quantity: {
          unit: 'GiB',
          value: 0,
        },
        totalPrice: 0,
      },
      incomingInternalBandwidth: {
        quantity: {
          unit: 'GiB',
          value: 0.0014659259468317,
        },
        totalPrice: 0,
      },
      outgoingBandwidth: {
        quantity: {
          unit: 'GiB',
          value: 0,
        },
        totalPrice: 0,
      },
      outgoingInternalBandwidth: {
        quantity: {
          unit: 'GiB',
          value: 0.0000039469450712,
        },
        totalPrice: 0,
      },
      region: 'region',
      stored: {
        quantity: {
          unit: 'GiBh',
          value: 0.0131933335214853,
        },
        totalPrice: 0,
      },
      totalPrice: 0,
      type: 'storage-standard',
    },
    {
      bucketName: 'test',
      incomingBandwidth: {
        quantity: {
          unit: 'GiB',
          value: 0,
        },
        totalPrice: 0,
      },
      incomingInternalBandwidth: {
        quantity: {
          unit: 'GiB',
          value: 0,
        },
        totalPrice: 0,
      },
      outgoingBandwidth: {
        quantity: {
          unit: 'GiB',
          value: 0,
        },
        totalPrice: 0,
      },
      outgoingInternalBandwidth: {
        quantity: {
          unit: 'GiB',
          value: 3.157183528e-7,
        },
        totalPrice: 0,
      },
      region: 'region',
      stored: {
        quantity: {
          unit: 'GiBh',
          value: 0,
        },
        totalPrice: 0,
      },
      totalPrice: 0,
      type: 'storage-standard',
    },
  ] as TStorage[];

  it('renders the datagrid when storages are present', () => {
    render(<ObjectStorageList storages={mockStorages} />);

    const datagrid = screen.getByTestId('datagrid');
    expect(datagrid).toBeTruthy();
  });

  it('renders no data message when no storages are present', () => {
    const { getByText } = render(<ObjectStorageList storages={[]} />);

    expect(getByText('cpbc_no_consumption_data')).toBeTruthy();
  });
});
