import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { wrapper } from '@/wrapperRenders';
import { TResourceUsage } from '@/api/hook/useConsumption';
import FileStorageList from './FileStorageList.component';

const mockUseShares = vi.hoisted(() => vi.fn());

vi.mock('@/api/hook/useShares', () => ({
  useShares: mockUseShares,
}));

describe('FileStorageList', () => {
  const billingShares: TResourceUsage[] = [
    {
      name: 'share',
      region: 'WAW1',
      totalPrice: 1.6587,
      resourceId: '77402726-715c-4531-a1e1-7de5292bec4c',
      quantity: { unit: 'Hour', value: 8550 },
    },
    {
      name: 'share',
      region: 'GRA9',
      totalPrice: 0.5,
      resourceId: 'unknown-id',
      quantity: { unit: 'Hour', value: 100 },
    },
  ];

  it('enriches name and type from the shares list (matched by resourceId/id)', () => {
    mockUseShares.mockReturnValue({
      data: [
        {
          id: '77402726-715c-4531-a1e1-7de5292bec4c',
          name: 'standard-1az_2026_04_17_10_37_12',
          region: 'WAW1',
          type: 'standard-1az',
        },
      ],
      isPending: false,
    });

    const { getByText } = render(<FileStorageList shares={billingShares} />, {
      wrapper,
    });

    expect(getByText('standard-1az_2026_04_17_10_37_12')).toBeInTheDocument();
    expect(getByText('standard-1az')).toBeInTheDocument();
  });

  it('falls back to the resourceId when the share is not found', () => {
    mockUseShares.mockReturnValue({ data: [], isPending: false });

    const { getByText } = render(<FileStorageList shares={billingShares} />, {
      wrapper,
    });

    expect(
      getByText('77402726-715c-4531-a1e1-7de5292bec4c'),
    ).toBeInTheDocument();
    expect(getByText('unknown-id')).toBeInTheDocument();
  });

  it('shows the no-data message when there is no share consumption', () => {
    mockUseShares.mockReturnValue({ data: [], isPending: false });

    const { getByText } = render(<FileStorageList shares={[]} />, { wrapper });

    expect(getByText('cpbc_no_consumption_data')).toBeInTheDocument();
  });

  it('shows a spinner while the shares list is loading', () => {
    mockUseShares.mockReturnValue({ data: undefined, isPending: true });

    const { container } = render(<FileStorageList shares={billingShares} />, {
      wrapper,
    });

    expect(container.querySelector('osds-spinner')).toBeInTheDocument();
  });
});
