import {
  organizationList,
  datacentreList,
} from '@ovh-ux/manager-module-vcd-api';
import { checkTextVisibility, labels, renderTest } from '../../../test-utils';

describe('Datacentre Dashboard Page', () => {
  it('display the datacentre dashboard page', async () => {
    await renderTest({
      initialRoute: `/${organizationList[0].id}/datacentres/${datacentreList[0].id}`,
    });

    await checkTextVisibility(labels.datacentres.managed_vcd_vdc_vcpu_count);
  });

  it('display an error', async () => {
    await renderTest({
      initialRoute: `/${organizationList[0].id}/datacentres/${datacentreList[0].id}`,
      isDatacentresKo: true,
    });

    await checkTextVisibility('Datacentre error');
  });
});
