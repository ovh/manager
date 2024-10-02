import 'element-internals-polyfill';
import { describe, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { RegionSelector } from '@/components/region-selector/RegionSelector.component';
import { TRegion } from '@/api/data';

vi.mock('react-use', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react-use')>()),
  useMedia: () => true,
}));

describe('RegionSelector', () => {
  it('should display zones', async () => {
    const regions: TRegion[] = [
      {
        name: 'BHS1.PREPROD',
        type: 'region',
        status: 'UP',
        services: [],
        continentCode: 'NA',
        datacenterLocation: 'BHS',
      },
      {
        name: 'GRA1.PREPROD',
        type: 'region',
        status: 'UP',
        services: [],
        continentCode: 'EU',
        datacenterLocation: 'GRA',
      },
      {
        name: 'GS1',
        type: 'localzone',
        status: 'UP',
        services: [],
        continentCode: 'EU',
        datacenterLocation: 'GS',
      },
      {
        name: 'PREPROD-SBG',
        type: 'region',
        status: 'UP',
        services: [],
        continentCode: 'EU',
        datacenterLocation: 'SBG',
      },
    ];

    const onSelectRegion = vi.fn();

    render(
      <RegionSelector regions={regions} onSelectRegion={onSelectRegion} />,
    );

    expect(
      screen.getByRole('listitem', { description: /WORLD/ }),
    ).toBeVisible();
  });
});
