import {
  organizationList,
  datacentreList,
} from '@ovh-ux/manager-module-vcd-api';
import {
  assertAsyncTextVisibility,
  assertTextVisibility,
} from '@ovh-ux/manager-core-test-utils';
import { labels, renderTest } from '../../../test-utils';
import { COMPUTE_LABEL, STORAGE_LABEL } from './datacentreDashboard.constants';

describe('Datacentre Dashboard Page', () => {
  it('display the datacentre dashboard page', async () => {
    await renderTest({
      initialRoute: `/${organizationList[0].id}/datacentres/${datacentreList[0].id}`,
    });

    const elements = [
      datacentreList[0].currentState.vCPUCount.toString(),
      labels.datacentres.managed_vcd_vdc_vcpu_count,
      labels.dashboard.managed_vcd_dashboard_description,
      COMPUTE_LABEL,
      STORAGE_LABEL,
    ];

    // TESTING : check asynchronously for the first element, then check synchronously
    await assertAsyncTextVisibility(elements[0]);
    elements.slice(1).forEach(assertTextVisibility);
  });

  it('display an error if datacentre service is KO', async () => {
    await renderTest({
      initialRoute: `/${organizationList[0].id}/datacentres/${datacentreList[0].id}`,
      isDatacentresKo: true,
    });

    await assertAsyncTextVisibility('Datacentre error');
  });
});
