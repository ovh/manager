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
import { DEFAULT_LISTING_ERROR, labels, renderTest } from '../../../test-utils';
import TEST_IDS from '../../../utils/testIds.constants';

describe('Datacentres Listing Page', () => {
  it('displays the virtual datacentres listing page', async () => {
    // when
    await renderTest({
      initialRoute: `/${organizationList[0].id}/datacentres`,
    });

    // then
    await assertTextVisibility(labels.datacentres.managed_vcd_vdc_title);

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
      initialRoute: `/${organizationList[0].id}/datacentres`,
      isDatacentresKo: true,
    });

    await assertTextVisibility(DEFAULT_LISTING_ERROR);
  });
});
