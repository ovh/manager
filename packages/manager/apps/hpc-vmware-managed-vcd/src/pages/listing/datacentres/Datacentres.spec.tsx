import { screen } from '@testing-library/react';
import {
  organizationList,
  datacentreList,
} from '@ovh-ux/manager-module-vcd-api';
import { assertAsyncTextVisibility } from '@ovh-ux/manager-core-test-utils';
import { DEFAULT_LISTING_ERROR, labels, renderTest } from '../../../test-utils';
import TEST_IDS from '../../../utils/testIds.constants';

describe('Datacentres Listing Page', () => {
  it('displays the virtual datacentres listing page', async () => {
    // when
    await renderTest({
      initialRoute: `/${organizationList[0].id}/datacentres`,
    });

    // then
    await assertAsyncTextVisibility(labels.datacentres.managed_vcd_vdc_title);

    // and
    const vdcLink = screen.getByTestId(TEST_IDS.listingDatacentreNameLink);

    expect(vdcLink).toBeVisible();
    expect(vdcLink).toHaveAttribute(
      'label',
      datacentreList[0].currentState.name,
    );
  });

  it('display an error', async () => {
    await renderTest({
      initialRoute: `/${organizationList[0].id}/datacentres`,
      isDatacentresKo: true,
    });

    await assertAsyncTextVisibility(DEFAULT_LISTING_ERROR);
  });
});
