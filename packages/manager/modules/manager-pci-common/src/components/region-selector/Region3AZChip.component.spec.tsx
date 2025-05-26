import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import { wrapper } from '@/wrapperRenders';
import { Region3AZChip } from './Region3AZChip.component';

describe('Region3AZChip', () => {
  it('renders tag with correct text', () => {
    const { container } = render(<Region3AZChip />, {
      wrapper,
    });
    const tagElt = container.querySelector('ods-badge');

    expect(tagElt).toBeInTheDocument();
    expect(tagElt).toHaveAttribute('label', 'pci_project_flavors_zone_3AZ');
  });
});
