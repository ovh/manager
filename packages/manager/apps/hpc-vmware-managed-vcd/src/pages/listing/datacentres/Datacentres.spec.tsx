import {
  organizationList,
  datacentreList,
} from '@ovh-ux/manager-module-vcd-api';
import {
  assertElementLabel,
  assertElementVisibility,
  assertTextVisibility,
  getElementByTestId,
} from '@ovh-ux/manager-core-test-utils';
import { vi } from 'vitest';

import { DEFAULT_LISTING_ERROR, renderTest } from '../../../test-utils';
import TEST_IDS from '../../../utils/testIds.constants';
import { VIRTUAL_DATACENTERS_LABEL } from '../../dashboard/organization/organizationDashboard.constants';

vi.mock('@ovh-ux/manager-react-shell-client', async (importOriginal) => {
  const original: typeof import('@ovh-ux/manager-react-shell-client') = await importOriginal();
  return {
    ...original,
    useNavigationGetUrl: vi.fn(([basePath, pathWithId]) => ({
      data: `${basePath}${pathWithId}`,
    })),
  };
});

describe('Datacentres Listing Page', () => {
  it.skip('displays the virtual datacentres listing page', async () => {
    // when
    await renderTest({
      initialRoute: `/${organizationList[0].id}/virtual-datacenters`,
      nbDatacentres: 1,
    });

    // then
    await assertTextVisibility(VIRTUAL_DATACENTERS_LABEL);

    // and
    const vdcLink = await getElementByTestId(
      TEST_IDS.listingDatacentreNameLink,
    );

    await assertElementVisibility(vdcLink);
    await assertElementLabel({
      element: vdcLink,
      label: datacentreList[0].currentState.name,
    });
  });

  it('display an error', async () => {
    await renderTest({
      initialRoute: `/${organizationList[0].id}/virtual-datacenters`,
      isDatacentresKo: true,
    });

    await assertTextVisibility(DEFAULT_LISTING_ERROR);
  });
});
