import userEvents from '@testing-library/user-event';
import { screen, waitFor } from '@testing-library/react';
import { organizationList } from '@ovh-ux/manager-module-vcd-api';
import { vi } from 'vitest';
import { assertTextVisibility } from '@ovh-ux/manager-core-test-utils';
import { renderTest, labels } from '../../../test-utils';

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
            data: organizationList,
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
    useServiceDetails: vi.fn().mockReturnValue({
      data: {
        billing: {
          nextBillingDate: '233892930823',
        },
      },
    }),
  };
});

describe('Organization Dashboard Page', () => {
  it('display the dashboard page', async () => {
    await renderTest();
    const link = screen.getByText(organizationList[0].currentState.fullName);
    expect(true).toBeTruthy();
    await waitFor(() => userEvents.click(link));

    await assertTextVisibility(
      labels.dashboard.managed_vcd_dashboard_data_protection,
    );

    await assertTextVisibility(organizationList[0].currentState.description);
  });

  // it('display an error', async () => {
  //   await renderTest({
  //     initialRoute: `/${organizationList[0].id}`,
  //     isOrganizationKo: true,
  //   });

  //   await assertTextVisibility('Organization error');
  // });
});
