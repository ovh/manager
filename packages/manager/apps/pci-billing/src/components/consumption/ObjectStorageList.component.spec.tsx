import { render } from '@testing-library/react';
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
      retrievalFees: {
        quantity: {
          unit: 'GiB',
          value: 0,
        },
        totalPrice: {
          value: 0,
        },
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
      retrievalFees: {
        quantity: {
          unit: 'GiB',
          value: 0,
        },
        totalPrice: {
          value: 0,
        },
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
      type: 'storage-standard-ia',
    },
  ] as TStorage[];

  it('should render storages', () => {
    const { getByText } = render(<ObjectStorageList storages={mockStorages} />);

    // Find bucket names
    expect(getByText('banner-changing-page')).toBeInTheDocument();
    expect(getByText('test')).toBeInTheDocument();

    // Find types
    expect(getByText('storage-standard')).toBeInTheDocument();
    expect(getByText('storage-standard-ia')).toBeInTheDocument();
  });
});
