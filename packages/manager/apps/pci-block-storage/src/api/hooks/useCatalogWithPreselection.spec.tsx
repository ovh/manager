import { renderHook } from '@testing-library/react';
import { useQueries } from '@tanstack/react-query';
import { describe, it, vi } from 'vitest';
import { TAPIVolume } from '@/api/data/volume';
import { TVolumeCatalog } from '@/api/data/catalog';
import {
  TVolumeRetypeModel,
  useCatalogWithPreselection,
} from '@/api/hooks/useCatalogWithPreselection';
import { is3az, mapRetypingVolumeCatalog } from '@/api/select/catalog';
import {
  EncryptionType,
  getEncryption,
  isClassicMultiAttach,
} from '@/api/select/volume';
import { TRegion } from '@/api/data/regions';

vi.mock('@tanstack/react-query', () => ({
  useQueries: vi.fn(),
}));

vi.mock('@/api/select/volume', async (importActual) => {
  const actual = await importActual<typeof import('axios')>();

  return {
    ...actual,
    getEncryption: vi.fn(),
    isClassicMultiAttach: vi.fn(),
  };
});

vi.mock('@/api/select/catalog', () => ({
  mapRetypingVolumeCatalog: vi.fn(),
  is3az: vi.fn(),
}));

vi.mock('@/api/hooks/useVolume', () => ({
  getVolumeQuery: vi.fn(),
}));

vi.mock('@/api/hooks/useCatalog', () => ({
  getVolumeCatalogQuery: vi.fn(),
}));

vi.mock('@ovh-ux/manager-react-components', () => ({
  useCatalogPrice: () => ({ getFormattedCatalogPrice: vi.fn() }),
}));

const PROJECT_ID = '123';
const VOLUME_ID = '1';

describe('useCatalogWithPreselection', () => {
  it.each(['region', 'localzone', 'region-3-az'])(
    'returns the mapped volume data, the encryption type and pending to false, given the volume is not multi-attached and region is "%s"',
    async (non3azRegionType: TRegion['type']) => {
      const notMultiAttachedVolumeMock = {
        region: 'volume region',
        type: 'type',
      } as TAPIVolume;

      const mockCatalog = {
        regions: [
          { name: notMultiAttachedVolumeMock.region, type: non3azRegionType },
        ],
      } as TVolumeCatalog;
      const mockMappedCatalog = [{}] as TVolumeRetypeModel[];

      vi.mocked(useQueries).mockReturnValue([
        { data: notMultiAttachedVolumeMock, isPending: false },
        { data: mockCatalog, isPending: false },
      ]);

      vi.mocked(mapRetypingVolumeCatalog).mockReturnValue(
        () => mockMappedCatalog,
      );
      vi.mocked(getEncryption).mockReturnValue(() => ({
        encrypted: true,
        encryptionType: EncryptionType.OMK,
      }));

      const { result } = renderHook(() =>
        useCatalogWithPreselection(PROJECT_ID, VOLUME_ID),
      );

      expect(result.current.data).toEqual(mockMappedCatalog);
      expect(result.current.preselectedEncryptionType).toBe(EncryptionType.OMK);
      expect(result.current.isPending).toBe(false);
    },
  );

  it.each(['region', 'localzone'])(
    'returns the mapped volume data, the encryption type and pending to false, given the volume is multi-attached and region is "%s"',
    async (non3azRegionType: TRegion['type']) => {
      const multiAttchedVolumeMock = {
        region: 'volume region',
        type: 'classic-multiattach',
      } as TAPIVolume;

      const mockCatalog = {
        regions: [
          { name: multiAttchedVolumeMock.region, type: non3azRegionType },
        ],
      } as TVolumeCatalog;
      const mockMappedCatalog = [{}] as TVolumeRetypeModel[];

      vi.mocked(useQueries).mockReturnValue([
        { data: multiAttchedVolumeMock, isPending: false },
        { data: mockCatalog, isPending: false },
      ]);

      vi.mocked(mapRetypingVolumeCatalog).mockReturnValue(
        () => mockMappedCatalog,
      );
      vi.mocked(getEncryption).mockReturnValue(() => ({
        encrypted: true,
        encryptionType: EncryptionType.OMK,
      }));

      const { result } = renderHook(() =>
        useCatalogWithPreselection(PROJECT_ID, VOLUME_ID),
      );

      expect(result.current.data).toEqual(mockMappedCatalog);
      expect(result.current.preselectedEncryptionType).toBe(EncryptionType.OMK);
      expect(result.current.isPending).toBe(false);
    },
  );

  it('should return empty array, null encryption and pending to false, given the volume is multi-attach and region is "region-3-az"', () => {
    const volumeMock = {
      region: 'volume region',
      type: 'classic-multiattach',
    } as TAPIVolume;

    const mockCatalog = {
      regions: [{ name: volumeMock.region, type: 'region-3-az' }],
    } as TVolumeCatalog;

    vi.mocked(useQueries).mockReturnValue([
      { data: volumeMock, isPending: false },
      { data: mockCatalog, isPending: false },
    ]);
    vi.mocked(is3az).mockReturnValue(true);
    vi.mocked(isClassicMultiAttach).mockReturnValue(true);

    const { result } = renderHook(() =>
      useCatalogWithPreselection(PROJECT_ID, VOLUME_ID),
    );

    expect(result.current.data).toEqual([]);
    expect(result.current.preselectedEncryptionType).toBe(null);
    expect(result.current.isPending).toBe(false);
  });

  it('should return no data and isPending to true if volume query is pending', () => {
    const mockCatalog = {} as TVolumeCatalog;

    vi.mocked(useQueries).mockReturnValue([
      { isPending: true },
      { data: mockCatalog, isPending: false },
    ]);

    const { result } = renderHook(() =>
      useCatalogWithPreselection(PROJECT_ID, VOLUME_ID),
    );

    expect(result.current.data).toBeNull();
    expect(result.current.preselectedEncryptionType).toBeNull();
    expect(result.current.isPending).toBe(true);
  });

  it('should return no data and isPending to true if catalog query is pending', () => {
    const volumeMock = {} as TAPIVolume;

    vi.mocked(useQueries).mockReturnValue([
      { data: volumeMock, isPending: false },
      { data: null, isPending: true },
    ]);

    const { result } = renderHook(() =>
      useCatalogWithPreselection(PROJECT_ID, VOLUME_ID),
    );

    expect(result.current.data).toBeNull();
    expect(result.current.preselectedEncryptionType).toBeNull();
    expect(result.current.isPending).toBe(true);
  });
});
