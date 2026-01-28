import { QueryObserverSuccessResult } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { TDeploymentModeData, TShareSpecData } from '@/adapters/catalog/left/shareCatalog.data';
import { useShareCatalog } from '@/data/hooks/catalog/useShareCatalog';
import { useCreateShareForm } from '@/pages/create/hooks/useCreateShareForm';
import { TFirstAvailableLocation } from '@/pages/create/view-model/shareCatalog.view-model';

vi.mock('@/data/hooks/catalog/useShareCatalog');

const mockUseShareCatalog = vi.mocked(useShareCatalog);

describe('useCreateShareForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseShareCatalog.mockReturnValue({
      data: undefined,
    } as unknown as QueryObserverSuccessResult<TFirstAvailableLocation | TShareSpecData[]>);
  });

  it('should initialize form with default values from catalog data', async () => {
    const firstAvailableLocation: TFirstAvailableLocation = {
      macroRegion: 'GRA',
      microRegion: 'GRA1',
    };

    const shareOptions: TShareSpecData[] = [
      {
        name: 'publiccloud-share-standard1',
        capacityMin: 150,
        capacityMax: 1024,
        iopsLevel: 30,
        bandwidthLevel: 0.25,
        bandwidthUnit: 'MB/s/GB',
      },
    ];

    mockUseShareCatalog
      .mockReturnValueOnce({
        data: [{ mode: 'region' }, { mode: 'region-3-az' }],
      } as unknown as QueryObserverSuccessResult<{ mode: TDeploymentModeData }[] | undefined>)
      .mockReturnValueOnce({
        data: firstAvailableLocation,
      } as unknown as QueryObserverSuccessResult<TFirstAvailableLocation | undefined>)
      .mockReturnValueOnce({
        data: shareOptions,
      } as unknown as QueryObserverSuccessResult<TShareSpecData[]>);

    const { result } = renderHook(() => useCreateShareForm());

    await waitFor(() => {
      expect(result.current.formState.isValid).toBeDefined();
    });

    const formValues = result.current.getValues();
    expect(formValues.shareData.microRegion).toBe('GRA1');
    expect(formValues.macroRegion).toBe('GRA');
    expect(formValues.shareData.specName).toBe('publiccloud-share-standard1');
    expect(formValues.shareData.size).toBe(150);
    expect(formValues.deploymentModes).toEqual(['region', 'region-3-az']);
    expect(formValues.continent).toBe('all');
    expect(formValues.availabilityZone).toBe(null);
    expect(formValues.shareData.name).toMatch(/^publiccloud-share-standard1_\d{2}_\d{2}_\d{4}$/);
  });

  it('should handle empty localizations array', async () => {
    mockUseShareCatalog
      .mockReturnValueOnce({
        data: [],
      } as unknown as QueryObserverSuccessResult<{ mode: TDeploymentModeData }[] | undefined>)
      .mockReturnValueOnce({
        data: undefined,
      } as unknown as QueryObserverSuccessResult<TFirstAvailableLocation | undefined>)
      .mockReturnValueOnce({
        data: [],
      } as unknown as QueryObserverSuccessResult<TShareSpecData[]>);

    const { result } = renderHook(() => useCreateShareForm());

    await waitFor(() => {
      expect(result.current.formState.isValid).toBeDefined();
    });

    const formValues = result.current.getValues();
    expect(formValues.shareData.microRegion).toBe('');
    expect(formValues.macroRegion).toBe('');
    expect(formValues.shareData.specName).toBe('');
    expect(formValues.shareData.size).toBe(150);
    // When shareOptions is empty, defaultShareName is '', so generateAutoName('') returns '_DD_MM_YYYY'
    expect(formValues.shareData.name).toMatch(/^_\d{2}_\d{2}_\d{4}$/);
  });

  it('should handle undefined catalog data', async () => {
    mockUseShareCatalog
      .mockReturnValueOnce({
        data: undefined,
      } as unknown as QueryObserverSuccessResult<{ mode: TDeploymentModeData }[] | undefined>)
      .mockReturnValueOnce({
        data: undefined,
      } as unknown as QueryObserverSuccessResult<TFirstAvailableLocation | undefined>)
      .mockReturnValueOnce({
        data: undefined,
      } as unknown as QueryObserverSuccessResult<TShareSpecData[]>);

    const { result } = renderHook(() => useCreateShareForm());

    await waitFor(() => {
      expect(result.current.formState.isValid).toBeDefined();
    });

    const formValues = result.current.getValues();
    expect(formValues.shareData.microRegion).toBe('');
    expect(formValues.macroRegion).toBe('');
    expect(formValues.shareData.specName).toBe('');
    expect(formValues.shareData.size).toBe(150);
  });

  it.each([
    { description: 'empty catalog', deploymentModesCatalog: [], expected: [] },
    { description: 'only region', deploymentModesCatalog: ['region'], expected: ['region'] },
    {
      description: 'only region-3-az',
      deploymentModesCatalog: ['region-3-az'],
      expected: ['region-3-az'],
    },
    {
      description: 'only localzone',
      deploymentModesCatalog: ['localzone'],
      expected: ['localzone'],
    },
    {
      description: 'region and region-3-az',
      deploymentModesCatalog: ['region', 'region-3-az'],
      expected: ['region', 'region-3-az'],
    },
    {
      description: 'region and localzone',
      deploymentModesCatalog: ['region', 'localzone'],
      expected: ['region'],
    },
    {
      description: 'region-3-az and localzone',
      deploymentModesCatalog: ['region-3-az', 'localzone'],
      expected: ['region-3-az'],
    },
    {
      description: 'region, region-3-az and localzone',
      deploymentModesCatalog: ['region', 'region-3-az', 'localzone'],
      expected: ['region', 'region-3-az'],
    },
  ])(
    'should set default deploymentModes to $expected when catalog has $description',
    async ({ deploymentModesCatalog, expected }) => {
      mockUseShareCatalog
        .mockReturnValueOnce({
          data: deploymentModesCatalog.map((mode) => ({ mode })),
        } as unknown as QueryObserverSuccessResult<{ mode: TDeploymentModeData }[] | undefined>)
        .mockReturnValueOnce({
          data: undefined,
        } as unknown as QueryObserverSuccessResult<TFirstAvailableLocation | undefined>)
        .mockReturnValueOnce({
          data: [],
        } as unknown as QueryObserverSuccessResult<TShareSpecData[]>);

      const { result } = renderHook(() => useCreateShareForm());

      await waitFor(() => {
        expect(result.current.formState.isValid).toBeDefined();
      });

      const formValues = result.current.getValues();
      expect(formValues.deploymentModes).toEqual(expected);
    },
  );

  it('should use first share option capacityMin as default size', async () => {
    const firstAvailableLocation: TFirstAvailableLocation = {
      macroRegion: 'GRA',
      microRegion: 'GRA1',
    };

    const shareOptions: TShareSpecData[] = [
      {
        name: 'publiccloud-share-standard1',
        capacityMin: 200,
        capacityMax: 1024,
        iopsLevel: 30,
        bandwidthLevel: 0.25,
        bandwidthUnit: 'MB/s/GB',
      },
    ];

    mockUseShareCatalog
      .mockReturnValueOnce({
        data: [{ mode: 'region' }, { mode: 'region-3-az' }],
      } as unknown as QueryObserverSuccessResult<{ mode: TDeploymentModeData }[] | undefined>)
      .mockReturnValueOnce({
        data: firstAvailableLocation,
      } as unknown as QueryObserverSuccessResult<TFirstAvailableLocation | undefined>)
      .mockReturnValueOnce({
        data: shareOptions,
      } as unknown as QueryObserverSuccessResult<TShareSpecData[]>);

    const { result } = renderHook(() => useCreateShareForm());

    await waitFor(() => {
      expect(result.current.formState.isValid).toBeDefined();
    });

    const formValues = result.current.getValues();
    expect(formValues.shareData.size).toBe(200);
  });
});
