import { screen, waitFor } from '@testing-library/react';
import { labels, renderTest } from '../../../test-utils';
import { datacentreList } from '../../../../mocks/vcd-organization/vcd-datacentre.mock';
import { organizationList } from '../../../../mocks/vcd-organization/vcd-organization.mock';
import { COMPUTE_TITLE, STORAGE_TITLE } from './DatacentreDashboard.constant';

describe('Datacentre Dashboard Page', () => {
  it('display the datacentre dashboard page', async () => {
    await renderTest({
      initialRoute: `/${organizationList[0].id}/datacentres/${datacentreList[0].id}`,
    });

    await waitFor(
      () =>
        expect(
          screen.getByText(labels.datacentres.managed_vcd_vdc_vcpu_count),
        ).toBeVisible(),
      { timeout: 30_000 },
    );

    expect(screen.getByText(COMPUTE_TITLE)).toBeVisible();
    expect(screen.getByText(STORAGE_TITLE)).toBeVisible();
  });

  it('display an error', async () => {
    await renderTest({
      initialRoute: `/${organizationList[0].id}/datacentres/${datacentreList[0].id}`,
      isDatacentresKo: true,
    });

    await waitFor(
      () => {
        expect(screen.getByText('Datacentres error')).toBeVisible();
      },
      { timeout: 30_000 },
    );
  });
});
