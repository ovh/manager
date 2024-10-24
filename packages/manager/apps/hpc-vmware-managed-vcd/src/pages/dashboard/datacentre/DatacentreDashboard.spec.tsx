import { checkTextVisibility, labels, renderTest } from '../../../test-utils';
import { datacentreList } from '../../../../mocks/vcd-organization/vcd-datacentre.mock';
import { organizationList } from '../../../../mocks/vcd-organization/vcd-organization.mock';

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
