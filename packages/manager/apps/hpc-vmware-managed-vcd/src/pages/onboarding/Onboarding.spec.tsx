import { vi } from 'vitest';
import { assertTextVisibility } from '@ovh-ux/manager-core-test-utils';
import { renderTest, labels } from '../../test-utils';

vi.mock('@ovh-ux/manager-react-components', async (managerComonents) => {
  const module = await managerComonents<
    typeof import('@ovh-ux/manager-react-components')
  >();
  return {
    ...module,
    useInfiniteQuery: vi.fn(),
    // useResourcesIcebergV2: vi.fn(),
    useResourcesIcebergV2: vi.fn().mockReturnValue({
      data: {
        pages: [
          {
            data: [],
            // data: [
            //   {
            //     id: 'value for id',
            //     cursorNext: 'P9/pJ3+99fFh2OXXXXX',
            //   },
            // ],
            status: 200,
            // cursorNext: 'P9/pJ3+99fFh2OXXXXX',
          },
        ],
      },
      status: 'success',
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      // cursorNext: 'P9/pJ3+99fFh2OXXXXX',
      isLoading: false,
      isFetchingNextPage: false,
    }),
    // useDatagridSearchParams: vi.fn().mockReturnValue({
    //   pagination: {
    //     pageIndex: 0,
    //     pageSize: 10,
    //   },
    //   setPagination: vi.fn(),
    //   sorting: { desc: false, id: 'value for id' },
    //   setSorting: vi.fn(),
    // }),
  };
});

// vi.mock('react-i18next', (importOriginal) => ({
//   ...importOriginal,
//   useTranslation: () => ({
//     t: (key: string, options: Record<string, unknown>) => {
//       if (key === 'managed_vcd_vdc_vcpu_value') {
//         return `${options.speed} GHz`;
//       }
//       return key;
//     },
//   }),
// }));

describe('Onboarding Page', () => {
  it('display the onboarding page if there is no VCD Organization', async () => {
    await renderTest({ nbOrganization: 0 });
    await assertTextVisibility(
      labels.onboarding.managed_vcd_onboarding_description_part1,
    );
  });
});
