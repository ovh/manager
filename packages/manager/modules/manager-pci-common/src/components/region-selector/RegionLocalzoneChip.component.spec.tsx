import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import { RegionLocalzoneChip } from './RegionLocalzoneChip.component';
import { wrapper } from '@/wrapperRenders';

describe('RegionLocalzoneChip', () => {
  it('renders tag with correct text', () => {
    const { container } = render(<RegionLocalzoneChip />, {
      wrapper,
    });
    const tagElt = container.querySelector('ods-badge');

    expect(tagElt).toBeInTheDocument();
    expect(tagElt).toHaveAttribute(
      'label',
      'pci_project_flavors_zone_localzone',
    );
  });
});
