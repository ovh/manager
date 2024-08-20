import { render, screen } from '@testing-library/react';
import { RegionGlobalzoneChip } from './RegionGlobalzoneChip.component';
import { wrapper } from '@/wrapperRenders';

describe('RegionGlobalzoneChip', () => {
  it('renders chip with correct text', () => {
    render(<RegionGlobalzoneChip />, { wrapper });
    expect(
      screen.getByText('pci_project_flavors_zone_global_region'),
    ).toBeInTheDocument();
  });
});
