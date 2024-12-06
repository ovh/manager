import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TInstanceBandWith } from '@/api/hook/useConsumption';
import OutgoingTrafficList from './OutgoingTrafficList.component';

describe('OutgoingTrafficList', () => {
  const mockInstanceBandwidths = [
    {
      incomingBandwidth: {
        quantity: {
          unit: 'GiB',
          value: 0,
        },
        totalPrice: 0,
      },
      outgoingBandwidth: {
        quantity: {
          unit: 'GiB',
          value: 7.33,
        },
        totalPrice: 0,
      },
      region: 'SGP1',
      totalPrice: 0,
    },
    {
      incomingBandwidth: {
        quantity: {
          unit: 'GiB',
          value: 0,
        },
        totalPrice: 0,
      },
      outgoingBandwidth: {
        quantity: {
          unit: 'GiB',
          value: 1,
        },
        totalPrice: 0,
      },
      region: 'AP-SOUTH-MUM-1',
      totalPrice: 0,
    },
    {
      incomingBandwidth: {
        quantity: {
          unit: 'GiB',
          value: 0,
        },
        totalPrice: 0,
      },
      outgoingBandwidth: {
        quantity: {
          unit: 'GiB',
          value: 4.09,
        },
        totalPrice: 0,
      },
      region: 'SYD1',
      totalPrice: 0,
    },
  ] as TInstanceBandWith[];

  it('renders the datagrid when instanceBandwidths are present', () => {
    render(<OutgoingTrafficList instanceBandwidths={mockInstanceBandwidths} />);

    const datagrid = screen.getByTestId('datagrid');
    expect(datagrid).toBeTruthy();
  });

  it('renders no data message when no instanceBandwidths are present', () => {
    const { getByText } = render(
      <OutgoingTrafficList instanceBandwidths={[]} />,
    );

    expect(getByText('cpbc_no_consumption_data')).toBeTruthy();
  });
});
