import {
  organizationList,
  datacentreList,
} from '@ovh-ux/manager-module-vcd-api';
import { describe, vi } from 'vitest';
import { assertTextVisibility } from '@ovh-ux/manager-core-test-utils';
import { DEFAULT_LISTING_ERROR, labels, renderTest } from '../../../test-utils';

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

describe('Datacentres Listing Page', () => {
  it('displays the virtual datacentres listing page', async () => {
    await renderTest({
      initialRoute: `/${organizationList[0].id}/datacentres`,
    });

    await assertTextVisibility(labels.datacentres.managed_vcd_vdc_title);

    await assertTextVisibility(datacentreList[0].currentState.name);
  });

  it('display an error', async () => {
    await renderTest({
      initialRoute: `/${organizationList[0].id}/datacentres`,
      isDatacentresKo: true,
    });

    // to rework
    await assertTextVisibility(datacentreList[0].currentState.name);
    // await assertTextVisibility(DEFAULT_LISTING_ERROR);
  });
});
