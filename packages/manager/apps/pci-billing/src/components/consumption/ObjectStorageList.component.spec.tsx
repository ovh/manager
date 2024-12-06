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

  it('matches snapshot with existing storages', () => {
    const { asFragment } = render(
      <ObjectStorageList storages={mockStorages} />,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('matches snapshot with empty storages', () => {
    const { asFragment } = render(<ObjectStorageList storages={[]} />);

    expect(asFragment()).toMatchSnapshot();
  });
});
