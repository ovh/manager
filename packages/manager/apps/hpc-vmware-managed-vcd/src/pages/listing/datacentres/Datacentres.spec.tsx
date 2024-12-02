import {
  organizationList,
  datacentreList,
} from '@ovh-ux/manager-module-vcd-api';
import { checkTextVisibility } from '@ovh-ux/manager-core-test-utils';
import { DEFAULT_LISTING_ERROR, labels, renderTest } from '../../../test-utils';

describe('Datacentres Listing Page', () => {
  it('displays the virtual datacentres listing page', async () => {
    await renderTest({
      initialRoute: `/${organizationList[0].id}/datacentres`,
    });

    await checkTextVisibility(labels.datacentres.managed_vcd_vdc_title);

    await checkTextVisibility(datacentreList[0].currentState.name);
  });

  it('display an error', async () => {
    await renderTest({
      initialRoute: `/${organizationList[0].id}/datacentres`,
      isDatacentresKo: true,
    });

    await checkTextVisibility(DEFAULT_LISTING_ERROR);
  });
});
