import {
  organizationList,
  datacentreList,
} from '@ovh-ux/manager-module-vcd-api';
import { assertTextVisibility } from '@ovh-ux/manager-core-test-utils';
import { DEFAULT_LISTING_ERROR, labels, renderTest } from '../../../test-utils';

describe.skip('Datacentres Listing Page', () => {
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

    await assertTextVisibility(DEFAULT_LISTING_ERROR);
  });
});
