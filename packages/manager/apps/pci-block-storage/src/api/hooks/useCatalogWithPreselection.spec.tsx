import { renderHook } from '@testing-library/react';
import { useQueries } from '@tanstack/react-query';
import { describe, it, vi } from 'vitest';
import { TAPIVolume } from '@/api/data/volume';
import { TVolumeCatalog } from '@/api/data/catalog';
import {
  TVolumeRetypeModel,
  useCatalogWithPreselection,
} from '@/api/hooks/useCatalogWithPreselection';
import { mapRetypingVolumeCatalog } from '@/api/select/catalog';
import { canRetype } from '@/api/select/volume';

vi.mock('@tanstack/react-query', () => ({
  useQueries: vi.fn(),
}));

vi.mock('@/api/select/volume', () => ({
  canRetype: vi.fn(),
}));

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

const volumeMock = {
  region: 'regionName',
} as TAPIVolume;

const mockCatalog = {
  regions: [{ name: 'regionName' }],
} as TVolumeCatalog;

const mockMappedCatalog = [{ name: 'volumeName' }] as TVolumeRetypeModel[];
const noData = [];

describe('useCatalogWithPreselection', () => {
  beforeEach(() => {
    vi.mocked(mapRetypingVolumeCatalog).mockReturnValue(
      () => mockMappedCatalog,
    );
  });

  it.each`
    canVolumeRetype | expectedData
    ${true}         | ${mockMappedCatalog}
    ${false}        | ${noData}
  `(
    'should return $expectedData when volume can retype: $canVolumeRetype',
    ({
      canVolumeRetype,
      expectedData,
    }: {
      canVolumeRetype: boolean;
      expectedData: TVolumeRetypeModel[];
    }) => {
      vi.mocked(useQueries).mockReturnValue([
        { data: volumeMock, isPending: false },
        { data: mockCatalog, isPending: false },
      ]);

      vi.mocked(canRetype).mockReturnValue(() => canVolumeRetype);

      const { result } = renderHook(() =>
        useCatalogWithPreselection(PROJECT_ID, VOLUME_ID),
      );

      expect(result.current.data).toEqual(expectedData);
      expect(result.current.isPending).toBe(false);
    },
  );

  it('should return no data and isPending to true if volume query is pending', () => {
    vi.mocked(useQueries).mockReturnValue([
      { data: null, isPending: true },
      { data: mockCatalog, isPending: false },
    ]);

    const { result } = renderHook(() =>
      useCatalogWithPreselection(PROJECT_ID, VOLUME_ID),
    );

    expect(result.current.data).toBeNull();
    expect(result.current.isPending).toBe(true);
  });

  it('should return no data and isPending to true if catalog query is pending', () => {
    vi.mocked(useQueries).mockReturnValue([
      { data: volumeMock, isPending: false },
      { data: null, isPending: true },
    ]);

    const { result } = renderHook(() =>
      useCatalogWithPreselection(PROJECT_ID, VOLUME_ID),
    );

    expect(result.current.data).toBeNull();
    expect(result.current.isPending).toBe(true);
  });
});
