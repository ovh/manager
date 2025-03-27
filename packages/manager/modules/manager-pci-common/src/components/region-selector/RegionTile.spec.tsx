import React from 'react';
import { describe, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { wrapper } from '@/wrapperRenders';
import { TLocalisation } from '@/components/region-selector/useRegions';
import {
  RegionTile,
  RegionTileProps,
} from '@/components/region-selector/RegionTile';

vi.mock('./RegionLocalzoneChip.component', () => ({
  RegionLocalzoneChip: () => `chip-localzone`,
}));
vi.mock('./RegionGlobalzoneChip.component', () => ({
  RegionGlobalzoneChip: () => `chip-region`,
}));
vi.mock('./Region3AZChip.component', () => ({
  Region3AZChip: () => `chip-region-3-az`,
}));

const POSSIBLE_REGIONS: Pick<
  RegionTileProps['region'],
  'isMacro' | 'macroLabel' | 'microLabel' | 'type'
>[] = [
  { isMacro: true, macroLabel: 'MacroRegion', microLabel: '', type: 'region' },
  { isMacro: false, macroLabel: '', microLabel: 'MicroRegion', type: 'region' },
  { isMacro: true, macroLabel: 'LocalZone', microLabel: '', type: 'localzone' },
  {
    isMacro: true,
    macroLabel: '3AZRegion',
    microLabel: '',
    type: 'region-3-az',
  },
];

const POSSIBLE_SELECTED: RegionTileProps['isSelected'][] = [true, false];

const POSSIBLE_COMPACT: RegionTileProps['isCompact'][] = [
  true,
  false,
  undefined,
];

describe('RegionTile', () => {
  POSSIBLE_REGIONS.forEach((region) => {
    POSSIBLE_SELECTED.forEach((isSelected) => {
      POSSIBLE_COMPACT.forEach((isCompact) => {
        it(`should render region ${region.macroLabel ||
          region.microLabel} with isSelected ${isSelected}, isCompact ${isCompact}`, () => {
          render(
            <RegionTile
              region={region as TLocalisation}
              isSelected={isSelected}
              isCompact={isCompact}
            />,
            { wrapper },
          );
          const label = screen.getByText(
            region.isMacro ? region.macroLabel : region.microLabel,
          );
          expect(label).toBeInTheDocument();
          if (isSelected) {
            expect(label).toHaveClass('font-bold');
          } else {
            expect(label).not.toHaveClass('font-bold');
          }

          const chip = screen.queryByText(`chip-${region.type}`);
          if (isCompact) {
            expect(chip).not.toBeInTheDocument();
          } else {
            expect(chip).toBeInTheDocument();
          }
        });
      });
    });
  });
});
