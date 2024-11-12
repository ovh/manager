import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';
import { useProductMaintenance } from './useMaintenance';

const { useProjectRegions, useMigrationSteins, regions } = vi.hoisted(() => ({
  useProjectRegions: vi.fn().mockReturnValue({
    data: [
      {
        name: 'REGION-1',
        type: 'RT',
        status: 'RS',
        continentCode: 'CC',
        datacenterLocation: 'DCL',
      },
    ],
  }),
  useMigrationSteins: vi.fn(),
  regions: ['REGION-1', 'REGION-2'],
}));

vi.mock('@ovh-ux/manager-pci-common', () => ({
  useProjectRegions,
}));

vi.mock('@ovh-ux/manager-react-components', () => ({
  useMigrationSteins,
}));

describe('useMaintenance', () => {
  it('should return hasMaintenance with false value when useMigrationSteins return empty array', async () => {
    useMigrationSteins.mockReturnValue({ data: [] });

    const { result } = renderHook(() =>
      useProductMaintenance('productId', regions),
    );

    expect(result.current.hasMaintenance).toBe(false);
  });

  it('should return hasMaintenance with true', () => {
    useMigrationSteins.mockReturnValue({
      data: [
        {
          date: 'date-1',
          zone: 'REGION-1',
          travaux: 'travaux-1',
        },
        {
          date: 'date-2',
          zone: 'REGION-2',
          travaux: 'travaux-2',
        },
      ],
    });

    const { result } = renderHook(() =>
      useProductMaintenance('productId', regions),
    );

    expect(result.current.hasMaintenance).toBe(true);
  });
});
