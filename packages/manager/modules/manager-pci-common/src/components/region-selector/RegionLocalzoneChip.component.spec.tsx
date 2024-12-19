import { render, screen } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import { RegionLocalzoneChip } from './RegionLocalzoneChip.component';
import { wrapper } from '@/wrapperRenders';
import { URL_INFO } from '@/components/region-selector/constants';
import { useIs1AZ } from '@/hooks/useIs1AZ/useIs1AZ';

vi.mock('@/hooks/useIs1AZ/useIs1AZ');

describe('RegionLocalzoneChip', () => {
  it.each([undefined, false, true])(
    'should render chip with showTooltip %s with correct texts and links',
    (showTooltip: boolean | undefined) => {
      vi.mocked(useIs1AZ).mockReturnValue(false);

      render(<RegionLocalzoneChip showTooltip={showTooltip} />, { wrapper });

      expect(
        screen.getByText('pci_project_flavors_zone_localzone'),
      ).toBeInTheDocument();

      if (showTooltip ?? true) {
        expect(
          screen.getByText('pci_project_flavors_zone_localzone_tooltip'),
        ).toBeInTheDocument();

        const link = screen.getByText('pci_project_flavors_zone_tooltip_link');
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', URL_INFO.LOCAL_ZONE.DEFAULT);
      } else {
        expect(
          screen.queryByText('pci_project_flavors_zone_localzone_tooltip'),
        ).not.toBeInTheDocument();
        expect(
          screen.queryByText('pci_project_flavors_zone_tooltip_link'),
        ).not.toBeInTheDocument();
      }
    },
  );

  it('should render chip with 3az link when is1AZ is enabled', () => {
    vi.mocked(useIs1AZ).mockReturnValue(true);

    render(<RegionLocalzoneChip showTooltip />, { wrapper });

    expect(
      screen.getByText('pci_project_flavors_zone_localzone_1AZ_tooltip'),
    ).toBeInTheDocument();
  });
});
