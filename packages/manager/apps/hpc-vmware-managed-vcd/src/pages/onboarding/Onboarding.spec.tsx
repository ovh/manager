import { assertAsyncTextVisibility } from '@ovh-ux/manager-core-test-utils';
import { renderTest, labels } from '../../test-utils';

describe('Onboarding Page', () => {
  it('display the onboarding page if there is no VCD Organization', async () => {
    await renderTest({ nbOrganization: 0 });
    assertAsyncTextVisibility(
      labels.onboarding.managed_vcd_onboarding_description_part1,
    );
  });
});
