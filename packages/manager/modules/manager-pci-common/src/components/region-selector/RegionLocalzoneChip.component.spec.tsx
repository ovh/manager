import { render, screen } from '@testing-library/react';
import { describe, it } from 'vitest';
import { RegionLocalzoneChip } from './RegionLocalzoneChip.component';
import { wrapper } from '@/wrapperRenders';

describe('RegionLocalzoneChip', () => {
  it('renders chip with correct text', () => {
    render(<RegionLocalzoneChip />, { wrapper });
    expect(
      screen.getByText('pci_project_flavors_zone_localzone'),
    ).toBeInTheDocument();
  });
});
