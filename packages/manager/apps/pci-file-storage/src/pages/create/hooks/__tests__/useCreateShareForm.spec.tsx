import { QueryObserverSuccessResult } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { TRegionData, TShareSpecData } from '@/adapters/catalog/left/shareCatalog.data';
import { useShareCatalog } from '@/data/hooks/catalog/useShareCatalog';
import { useCreateShareForm } from '@/pages/create/hooks/useCreateShareForm';

vi.mock('@/data/hooks/catalog/useShareCatalog');

const mockUseShareCatalog = vi.mocked(useShareCatalog);

describe('useCreateShareForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Set default return value for useShareCatalog
    mockUseShareCatalog.mockReturnValue({
      data: [],
    } as unknown as QueryObserverSuccessResult<TRegionData[] | TShareSpecData[]>);
  });

  it('should initialize form with default values from catalog data', async () => {
    const availableLocation = {
      microRegion: 'GRA1',
      macroRegion: 'GRA',
      available: true,
    } as TRegionData;

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
        data: [availableLocation],
      } as unknown as QueryObserverSuccessResult<TRegionData[]>)
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
      } as unknown as QueryObserverSuccessResult<TRegionData[]>)
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
      } as unknown as QueryObserverSuccessResult<TRegionData | undefined>)
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

  it('should use first share option capacityMin as default size', async () => {
    const availableLocation = {
      microRegion: 'GRA1',
      macroRegion: 'GRA',
      available: true,
    } as TRegionData;

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
        data: [availableLocation],
      } as unknown as QueryObserverSuccessResult<TRegionData[]>)
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
