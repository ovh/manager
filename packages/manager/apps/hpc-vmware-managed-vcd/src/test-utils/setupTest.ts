import { vi } from 'vitest';
import {
  organizationList,
  datacentreList,
  backupList,
} from '@ovh-ux/manager-module-vcd-api';
import '@ovh-ux/manager-core-test-utils/setup-file-msw-ods17.tsx';

vi.mock('@ovh-ux/manager-react-components', async (managerComonents) => {
  const module = await managerComonents<
    typeof import('@ovh-ux/manager-react-components')
  >();
  return {
    ...module,
    useInfiniteQuery: vi.fn(),
    useResourcesIcebergV2: vi.fn().mockReturnValue({
      data: {
        pages: [
          {
            data: datacentreList,
            status: 200,
            cursorNext: 'P9/pJ3+99fFh2OXXXXX',
          },
        ],
      },
      status: 'success',
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      cursorNext: 'P9/pJ3+99fFh2OXXXXX',
      isLoading: false,
      isFetchingNextPage: false,
    }),
  };
});

vi.mock(import('@ovh-ux/manager-module-vcd-api'), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useVcdDatacentre: vi.fn().mockImplementation(() => ({
      data: datacentreList,
    })),
    useVcdOrganization: vi.fn().mockImplementation(() => ({
      data: organizationList,
    })),
    useVeeamBackup: vi.fn().mockImplementation(() => ({
      data: backupList,
    })),
  };
});
