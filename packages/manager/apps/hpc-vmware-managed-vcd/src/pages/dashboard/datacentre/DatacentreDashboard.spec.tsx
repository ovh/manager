import {
  organizationList,
  datacentreList,
} from '@ovh-ux/manager-module-vcd-api';
import { assertTextVisibility } from '@ovh-ux/manager-core-test-utils';
import { labels, renderTest } from '../../../test-utils';
import { COMPUTE_LABEL, STORAGE_LABEL } from './datacentreDashboard.constants';

describe('Datacentre Dashboard Page', () => {
  it('display the datacentre dashboard page', async () => {
    await renderTest({
      initialRoute: `/${organizationList[0].id}/virtual-datacenters/${datacentreList[0].id}`,
    });

    const layoutElements = [
      datacentreList[0].id,
      datacentreList[0].currentState.description,
      labels.dashboard.managed_vcd_dashboard_general_information,
      COMPUTE_LABEL,
      STORAGE_LABEL,
    ];

    layoutElements.forEach(async (element) => assertTextVisibility(element));
  });

  it('display an error is datacentre service is KO', async () => {
    await renderTest({
      initialRoute: `/${organizationList[0].id}/virtual-datacenters/${datacentreList[0].id}`,
      isDatacentresKo: true,
    });

    await assertTextVisibility('Datacentre error');
  });
});
