import { render, screen } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import { AvailablePart } from './Available.part';
import { useLocations } from '@/api/hooks/useRegions';

vi.mock('@/api/hooks/useRegions');

describe('AvailablePart', () => {
  it('should render the component', () => {
    vi.mocked(useLocations).mockReturnValue({
      data: [],
      isPending: false,
    } as never);

    render(<AvailablePart isMobile={false} />);
    expect(
      screen.getByText('pci_projects_project_regions_added_title'),
    ).toBeInTheDocument();
  });

  it('should render spinner when isPending is true', () => {
    vi.mocked(useLocations).mockReturnValue({
      data: [],
      isPending: true,
    } as never);

    render(<AvailablePart isMobile={false} />);
    expect(screen.getByTestId('available-spinner')).toBeInTheDocument();
  });

  it('should render locations when isPending is false', () => {
    vi.mocked(useLocations).mockReturnValue({
      data: [
        {
          name: 'Location 1',
          continent: 'Continent 1',
          regions: ['region-1', 'region-2'],
        },
      ],
      isPending: false,
    } as never);

    render(<AvailablePart isMobile={false} />);
    expect(screen.getByText('Location 1')).toBeInTheDocument();
  });

  it('should render message when no locations are available', () => {
    vi.mocked(useLocations).mockReturnValue({
      data: [],
      isPending: false,
    } as never);

    render(<AvailablePart isMobile={false} />);
    expect(
      screen.getByText('pci_projects_project_regions_all_added'),
    ).toBeInTheDocument();
  });
});
