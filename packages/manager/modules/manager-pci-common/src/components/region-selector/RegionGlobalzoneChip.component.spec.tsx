import { render } from '@testing-library/react';
import { RegionGlobalzoneChip } from './RegionGlobalzoneChip.component';
import { wrapper } from '@/wrapperRenders';

describe('RegionGlobalzoneChip', () => {
  it('renders tag with correct text', () => {
    const { container } = render(<RegionGlobalzoneChip />, {
      wrapper,
    });
    const tagElt = container.querySelector('ods-badge');

    expect(tagElt).toBeInTheDocument();
    expect(tagElt).toHaveAttribute('label', 'pci_project_flavors_zone_1AZ');
  });
});
