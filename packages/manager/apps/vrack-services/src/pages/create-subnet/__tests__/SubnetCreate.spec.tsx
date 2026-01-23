import { describe, it } from 'vitest';

import { assertTextVisibility } from '@ovh-ux/manager-core-test-utils';

import { labels } from '@/__tests__/test-i18n';
import { renderTestComponent } from '@/__tests__/uiTestHelpers';

import SubnetCreate from '../SubnetCreate.page';

describe('Vrack Services subnets page test suite', () => {
  it('should display a subnet creation page', async () => {
    const { container } = await renderTestComponent({
      component: <SubnetCreate />,
    });
    await assertTextVisibility(labels.subnets.subnetNameLabel);
    await assertTextVisibility(labels.subnets.cidrLabel);
    await assertTextVisibility(labels.subnets.serviceRangeLabel);
    await assertTextVisibility(labels.subnets.serviceRangeAdditionalText);
    await assertTextVisibility(labels.subnets.vlanLabel);
    expect(container).toMatchSnapshot();
  });
});
