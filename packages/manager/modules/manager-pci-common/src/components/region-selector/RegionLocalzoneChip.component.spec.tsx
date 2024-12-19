import { render, screen } from '@testing-library/react';
import { describe, it } from 'vitest';
import { RegionLocalzoneChip } from './RegionLocalzoneChip.component';
import { wrapper } from '@/wrapperRenders';
import { URL_INFO } from '@/components/region-selector/constants';

describe('RegionLocalzoneChip', () => {
  it.each([undefined, false, true])(
    'should render chip with showTooltip %s with correct texts and links',
    (showTooltip: boolean | undefined) => {
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
});
