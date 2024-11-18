import { render, waitFor, fireEvent, screen } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import { ToAddPart, ToAddPartProps } from './ToAdd.part';

describe('ToAddPart', () => {
  const defaultProps: ToAddPartProps = {
    selectedRegions: { 'Region 1': 'region-1' },
    setSelectedRegion: vi.fn(),
    locations: [
      {
        name: 'Location 1',
        continent: 'Continent 1',
        regions: ['region-1', 'region-2'],
      },
    ],
    isPending: false,
    selectedLocation: {
      name: 'Location 1',
      continent: 'Continent 1',
      regions: ['region-1', 'region-2'],
    },
    onInput: vi.fn(),
    isMobile: false,
  };

  it('should render the component', () => {
    const { getByText } = render(<ToAddPart {...defaultProps} />);
    expect(
      getByText('pci_projects_project_regions_available_to_add_title'),
    ).toBeInTheDocument();
  });

  it('should render spinner when isPending is true', () => {
    const { getByTestId } = render(
      <ToAddPart {...defaultProps} isPending={true} />,
    );
    expect(getByTestId('toadd-spinner')).toBeInTheDocument();
  });

  it('should render locations when isPending is false', () => {
    const { getByText } = render(<ToAddPart {...defaultProps} />);
    expect(getByText('Location 1')).toBeInTheDocument();
  });

  it('should call setSelectedRegion when a region is selected', async () => {
    render(<ToAddPart {...defaultProps} />);
    const select = screen.getByTestId('region-select');
    fireEvent.change(select, { target: { value: 'region-2' } });
    await waitFor(() => {
      expect(defaultProps.setSelectedRegion).toHaveBeenCalledWith(
        'Location 1',
        'region-2',
      );
    });
  });

  it('should render message when no locations are available', () => {
    const { getByText } = render(
      <ToAddPart {...defaultProps} locations={[]} />,
    );
    expect(
      getByText('pci_projects_project_regions_all_added'),
    ).toBeInTheDocument();
  });
});
