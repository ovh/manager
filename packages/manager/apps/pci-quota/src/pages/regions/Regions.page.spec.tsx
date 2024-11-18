import { render, screen } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import RegionsPage from './Regions.page';
import {
  useGetAvailableRegions,
  useAvailableLocations,
} from '@/api/hooks/useRegions';
import { wrapper } from '@/wrapperRenders';

vi.mock('@/api/hooks/useRegions', async () => ({
  useGetAvailableRegions: vi.fn(),
  useLocations: vi.fn().mockReturnValue({ data: [], isPending: false }),
  useAvailableLocations: vi
    .fn()
    .mockReturnValue({ data: [], isPending: false }),
}));

vi.mock('react-use', () => ({
  useMedia: vi.fn(),
}));

describe('RegionsPage', () => {
  it('should render the page', () => {
    vi.mocked(useGetAvailableRegions).mockReturnValue({
      data: [],
      isPending: false,
    } as never);
    render(<RegionsPage />, { wrapper });
    expect(
      screen.getByText('pci_projects_project_regions_title'),
    ).toBeInTheDocument();
  });

  it('should render the available regions part', () => {
    render(<RegionsPage />);
    expect(
      screen.getByText('pci_projects_project_regions_available_to_add_title'),
    ).toBeInTheDocument();
  });

  it('should render the to add part', () => {
    vi.mocked(useGetAvailableRegions).mockReturnValue({
      data: [],
      isPending: false,
    } as never);
    render(<RegionsPage />, { wrapper });
    expect(
      screen.getAllByText('pci_projects_project_regions_all_added').length,
    ).toBeDefined();
  });

  it('should show loading spinner when isPending is true', () => {
    vi.mocked(useAvailableLocations).mockReturnValue({
      data: [],
      isPending: true,
    } as never);
    render(<RegionsPage />);
    expect(screen.getByTestId('toadd-spinner')).toBeInTheDocument();
  });
});
