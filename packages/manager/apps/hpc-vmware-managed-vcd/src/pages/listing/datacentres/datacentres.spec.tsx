import { screen, waitFor } from '@testing-library/react';
import { labels, renderTest } from '../../../test-utils';
import { datacentreList } from '../../../../mocks/vcd-organization/vcd-datacentre.mock';
import { organizationList } from '../../../../mocks/vcd-organization/vcd-organization.mock';

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
});
