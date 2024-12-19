import { render, screen } from '@testing-library/react';
import { describe, it } from 'vitest';
import { wrapper } from '@/wrapperRenders';
import { Region3AZChip } from '@/components/region-selector/Region3AZChip.component';
import { URL_INFO } from '@/components/region-selector/constants';

describe('Region3AZChip', () => {
  it.each([undefined, false, true])(
    'should render chip with showTooltip %s with correct texts and links',
    (showTooltip: boolean | undefined) => {
      render(<Region3AZChip showTooltip={showTooltip} />, { wrapper });

      expect(
        screen.getByText('pci_project_flavors_zone_3AZ'),
      ).toBeInTheDocument();

      if (showTooltip ?? true) {
        expect(
          screen.getByText('pci_project_flavors_zone_3AZ_tooltip'),
        ).toBeInTheDocument();

        const link = screen.getByText('pci_project_flavors_zone_tooltip_link');
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', URL_INFO.REGION_3AZ.DEFAULT);
      } else {
        expect(
          screen.queryByText('pci_project_flavors_zone_3AZ_tooltip'),
        ).not.toBeInTheDocument();
        expect(
          screen.queryByText('pci_project_flavors_zone_tooltip_link'),
        ).not.toBeInTheDocument();
      }
    },
  );
});
