import { useParams } from 'react-router-dom';

import '@testing-library/jest-dom';
import { describe, expect, it, vi } from 'vitest';

import { licensesMock } from '@/data/api/__mocks__/license';
import { mockOfficeLicenseServiceInfos } from '@/data/api/__mocks__/serviceInfos';
import { mockUsageStatistics } from '@/data/api/__mocks__/usageStatistics';
import { renderWithRouter } from '@/utils/Test.provider';

import Consumption from '../Consumption.page';

const hoistedMock = vi.hoisted(() => ({
  useServiceInfos: vi.fn(),
  getOfficeUsageStatistics: vi.fn(),
}));

describe('Consumption Component', () => {
  vi.mocked(useParams).mockReturnValue({
    serviceName: licensesMock[0].serviceName,
  });
  hoistedMock.useServiceInfos.mockReturnValue({
    data: mockOfficeLicenseServiceInfos,
    isLoading: false,
  });
  hoistedMock.getOfficeUsageStatistics.mockReturnValue({
    data: mockUsageStatistics,
    isLoading: false,
  });

  it('should render the component correctly', () => {
    const { getByTestId } = renderWithRouter(<Consumption />);
    expect(getByTestId('period-select')).toBeInTheDocument();
  });

  it('should render the responsive chart container', () => {
    const { container } = renderWithRouter(<Consumption />);

    const chartContainer = container.querySelector('.recharts-responsive-container');
    expect(chartContainer).toBeInTheDocument();
  });
});

describe('Consumption W3C Validation', () => {
  // issue with ods on ods-select and option child element
  it.skip('should have a valid html', async () => {
    const { container } = renderWithRouter(<Consumption />);
    const html = container.innerHTML;

    await expect(html).toBeValidHtml();
  });
});
