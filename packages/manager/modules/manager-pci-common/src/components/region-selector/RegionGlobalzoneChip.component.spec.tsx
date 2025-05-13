import { render } from '@testing-library/react';
import { RegionGlobalzoneChip } from './RegionGlobalzoneChip.component';
import { wrapper } from '@/wrapperRenders';

describe('RegionGlobalzoneChip', () => {
  it('renders tag with correct text', () => {
    const { container } = render(<RegionGlobalzoneChip id="fake-id" />, {
      wrapper,
    });
    const tagElt = container.querySelector('#fake-id').firstChild;

    expect(tagElt).toBeInTheDocument();
    expect(tagElt).toHaveAttribute(
      'label',
      'pci_project_flavors_zone_global_region',
    );
  });
});
