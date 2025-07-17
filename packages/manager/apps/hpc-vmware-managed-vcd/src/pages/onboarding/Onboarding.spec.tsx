import { assertTextVisibility } from '@ovh-ux/manager-core-test-utils';
import { renderTest, labels } from '../../test-utils';
import { VMWARE_CLOUD_DIRECTOR_LABEL } from '../../utils/label.constants';

describe('Onboarding Page', () => {
  it('display the onboarding page if there is no VCD Organization', async () => {
    await renderTest({ nbOrganization: 0 });
    await assertTextVisibility(
      labels.onboarding.managed_vcd_onboarding_description_part1.replace(
        '{{productName}}',
        VMWARE_CLOUD_DIRECTOR_LABEL,
      ),
    );
  });
});
