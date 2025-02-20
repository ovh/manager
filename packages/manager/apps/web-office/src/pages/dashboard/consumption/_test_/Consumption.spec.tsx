import React from 'react';
import '@testing-library/jest-dom';
import { describe, expect, it, vi } from 'vitest';
import { useParams } from 'react-router-dom';
import { render } from '@/utils/test.provider';
import Consumption from '../Consumption';
import {
  licensesMock,
  mockOfficeLicenseServiceInfos,
  mockUsageStatistics,
} from '@/api/_mock_';

const hoistedMock = vi.hoisted(() => ({
  useOfficeServiceInfos: vi.fn(),
  getOfficeUsageStatistics: vi.fn(),
}));

describe('Consumption Component', () => {
  vi.mocked(useParams).mockReturnValue({
    serviceName: licensesMock[0].serviceName,
  });
  hoistedMock.useOfficeServiceInfos.mockReturnValue({
    data: mockOfficeLicenseServiceInfos,
    isLoading: false,
  });
  hoistedMock.getOfficeUsageStatistics.mockReturnValue({
    data: mockUsageStatistics,
    isLoading: false,
  });

  it('should render the component correctly', async () => {
    const { getByTestId } = render(<Consumption />);
    expect(getByTestId('period-select')).toBeInTheDocument();
  });

  it('should render the responsive chart container', async () => {
    const { container } = render(<Consumption />);

    const chartContainer = container.querySelector(
      '.recharts-responsive-container',
    );
    expect(chartContainer).toBeInTheDocument();
  });
});
