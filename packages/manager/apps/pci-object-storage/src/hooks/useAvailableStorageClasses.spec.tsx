import { renderHook, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { StorageClassEnum } from '@datatr-ux/ovhcloud-types/cloud/storage';
import * as regionAPI from '@/data/api/region/region.api';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import {
  mockedRegion,
  mocked3AZRegion,
  mockedLZRegion,
} from '@/__tests__/helpers/mocks/region/region';
import { useAvailableStorageClasses } from './useAvailableStorageClasses.hook';
import cloud from '@/types/Cloud';
import { Region3AZ } from '@/configuration/region.const';

vi.mock('@/data/api/region/region.api', () => ({
  getRegions: vi.fn(),
}));

vi.mock('@ovh-ux/manager-module-common-api', () => ({
  useFeatureAvailability: () => ({
    data: {
      'pci-object-storage:storage-class-active-archive': true,
    },
  }),
}));

const mockedMilan3AZRegion: cloud.Region = {
  ...mockedRegion,
  name: Region3AZ.MILAN,
  datacenterLocation: Region3AZ.MILAN,
  type: cloud.RegionTypeEnum['region-3-az'],
};

interface TestCase {
  regionName: string;
  regionMock: cloud.Region;
  expectedClasses: StorageClassEnum[];
  notExpectedClasses: StorageClassEnum[];
}

const testCases: TestCase[] = [
  {
    regionName: 'EU-WEST-PAR (3-AZ Paris)',
    regionMock: mocked3AZRegion,
    expectedClasses: [
      StorageClassEnum.STANDARD,
      StorageClassEnum.STANDARD_IA,
      StorageClassEnum.DEEP_ARCHIVE,
      StorageClassEnum.GLACIER_IR,
    ],
    notExpectedClasses: [StorageClassEnum.HIGH_PERF],
  },
  {
    regionName: Region3AZ.MILAN,
    regionMock: mockedMilan3AZRegion,
    expectedClasses: [
      StorageClassEnum.STANDARD,
      StorageClassEnum.STANDARD_IA,
      StorageClassEnum.GLACIER_IR,
    ],
    notExpectedClasses: [
      StorageClassEnum.HIGH_PERF,
      StorageClassEnum.DEEP_ARCHIVE,
    ],
  },
  {
    regionName: 'BHS (1-AZ standard)',
    regionMock: mockedRegion,
    expectedClasses: [
      StorageClassEnum.STANDARD,
      StorageClassEnum.STANDARD_IA,
      StorageClassEnum.HIGH_PERF,
    ],
    notExpectedClasses: [
      StorageClassEnum.DEEP_ARCHIVE,
      StorageClassEnum.GLACIER_IR,
    ],
  },
  {
    regionName: 'RBX (LocalZone)',
    regionMock: mockedLZRegion,
    expectedClasses: [StorageClassEnum.STANDARD, StorageClassEnum.HIGH_PERF],
    notExpectedClasses: [
      StorageClassEnum.STANDARD_IA,
      StorageClassEnum.DEEP_ARCHIVE,
      StorageClassEnum.GLACIER_IR,
    ],
  },
];

describe('useAvailableStorageClasses', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return empty array when regions are not loaded', async () => {
    vi.mocked(regionAPI.getRegions).mockResolvedValue([]);

    const { result } = renderHook(
      () => useAvailableStorageClasses('EU-WEST-PAR'),
      { wrapper: QueryClientWrapper },
    );

    await waitFor(() => {
      expect(result.current.availableStorageClasses).toEqual([]);
    });
  });

  describe.each(testCases)(
    'for region $regionName',
    ({ regionMock, expectedClasses, notExpectedClasses }) => {
      it.each(expectedClasses)('should include %s', async (storageClass) => {
        vi.mocked(regionAPI.getRegions).mockResolvedValue([regionMock]);

        const { result } = renderHook(
          () => useAvailableStorageClasses(regionMock.name),
          { wrapper: QueryClientWrapper },
        );

        await waitFor(() => {
          expect(result.current.availableStorageClasses).toContain(
            storageClass,
          );
        });
      });

      it.each(notExpectedClasses)(
        'should not include %s',
        async (storageClass) => {
          vi.mocked(regionAPI.getRegions).mockResolvedValue([regionMock]);

          const { result } = renderHook(
            () => useAvailableStorageClasses(regionMock.name),
            { wrapper: QueryClientWrapper },
          );

          await waitFor(() => {
            expect(result.current.availableStorageClasses).not.toContain(
              storageClass,
            );
          });
        },
      );
    },
  );
});
