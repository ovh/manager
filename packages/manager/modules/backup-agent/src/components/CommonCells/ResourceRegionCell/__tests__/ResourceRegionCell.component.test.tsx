import React from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { mockLocations } from '@/mocks/location/locations';
import { mockVaults } from '@/mocks/vaults/vaults.mock';
import { DataGridTextCellMock } from '@/test-utils/mocks/manager-react-components';

import { ResourceRegionCell } from '../ResourceRegionCell.component';

const { mockLocationDetails } = vi.hoisted(() => {
  return {
    mockLocationDetails: vi.fn(),
  };
});

vi.mock('@/data/hooks/location/getLocationDetails', () => ({
  useLocationDetails: mockLocationDetails,
}));

vi.mock('@ovh-ux/manager-react-components', () => ({
  DataGridTextCell: DataGridTextCellMock,
}));

describe('ResourceRegionCell', () => {
  it('renders resourceName from currentState', async () => {
    mockLocationDetails.mockReturnValue({
      data: mockLocations[0],
      isLoading: false,
      isError: false,
    });
    const vault = mockVaults[0]!;

    render(<ResourceRegionCell region={vault.currentState.region} />);

    await waitFor(() =>
      expect(screen.getByTestId('cell')).toHaveTextContent(mockLocations[0]!.name),
    );
    expect(mockLocationDetails).toHaveBeenCalledWith(mockVaults[0]!.currentState.region);
  });

  it('renders during loading', async () => {
    mockLocationDetails.mockReturnValue({ data: null, isLoading: true, isError: false });
    const vault = mockVaults[0]!;

    const { container } = render(<ResourceRegionCell region={vault.currentState.region} />);

    await waitFor(() => expect(container.querySelector('ods-skeleton')).toBeVisible());
    expect(mockLocationDetails).toHaveBeenCalledWith(mockVaults[0]!.currentState.region);
  });

  it('renders during error', async () => {
    mockLocationDetails.mockReturnValue({ data: null, isLoading: false, isError: true });
    const vault = mockVaults[0]!;

    render(<ResourceRegionCell region={vault.currentState.region} />);

    await waitFor(() =>
      expect(screen.getByTestId('cell')).toHaveTextContent(mockVaults[0]!.currentState.region),
    );
    expect(mockLocationDetails).toHaveBeenCalledWith(mockVaults[0]!.currentState.region);
  });
});
