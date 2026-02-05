import { vi } from 'vitest';

import {
  assertElementLabel,
  assertElementVisibility,
  assertTextVisibility,
  getElementByTestId,
} from '@ovh-ux/manager-core-test-utils';

import { SAFE_MOCK_DATA } from '@/test-utils/safeMockData.utils';

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

const config = {
  org: SAFE_MOCK_DATA.orgStandard,
  vdc: SAFE_MOCK_DATA.vdcStandard,
};
const initialRoute = `/${config.org.id}/virtual-datacenters`;

describe('Datacentres Listing Page', () => {
  it.skip('displays the virtual datacentres listing page', async () => {
    // when
    await renderTest({ initialRoute, nbDatacentres: 1 });

    // then
    await assertTextVisibility(VIRTUAL_DATACENTERS_LABEL);

    // and
    const vdcLink = await getElementByTestId(TEST_IDS.listingDatacentreNameLink);

    await assertElementVisibility(vdcLink);
    await assertElementLabel({
      element: vdcLink,
      label: config.vdc.currentState.name,
    });
  });

  it('display an error', async () => {
    await renderTest({ initialRoute, isDatacentresKo: true });

    await assertTextVisibility(DEFAULT_LISTING_ERROR);
  });
});
