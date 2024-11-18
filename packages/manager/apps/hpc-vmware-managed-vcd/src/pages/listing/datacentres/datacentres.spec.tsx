import { screen, waitFor } from '@testing-library/react';
import {
  organizationList,
  datacentreList,
} from '@ovh-ux/manager-module-vcd-api';
import {
  checkTextVisibility,
  DEFAULT_LISTING_ERROR,
  labels,
  renderTest,
} from '../../../test-utils';

describe('Datacentres Listing Page', () => {
  it('displays the virtual datacentres listing page', async () => {
    await renderTest({
      initialRoute: `/${organizationList[0].id}/datacentres`,
    });

    await waitFor(
      () =>
        expect(
          screen.getByText(labels.datacentres.managed_vcd_vdc_title),
        ).toBeVisible(),
      { timeout: 30_000 },
    );

    await waitFor(() =>
      expect(
        screen.getByText(datacentreList[0].currentState.name),
      ).toBeVisible(),
    );
  });

  it('display an error', async () => {
    await renderTest({
      initialRoute: `/${organizationList[0].id}/datacentres`,
      isDatacentresKo: true,
    });

    await checkTextVisibility(DEFAULT_LISTING_ERROR);
  });
});
