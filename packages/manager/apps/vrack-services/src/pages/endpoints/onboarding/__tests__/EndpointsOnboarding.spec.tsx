import { describe, it } from 'vitest';

import { assertTextVisibility } from '@ovh-ux/manager-core-test-utils';

import { labels } from '@/__tests__/test-i18n';
import { renderTestComponent } from '@/__tests__/uiTestHelpers';

import EndpointsOnboarding from '../EndpointsOnboarding.page';

describe('EndpointsOnboarding', () => {
  it('should display the endpoints onboarding', async () => {
    const { container } = await renderTestComponent({
      nbVs: 1,
      component: <EndpointsOnboarding />,
    });
    await assertTextVisibility(labels.endpoints.endpointsOnboardingTitle);
    expect(container).toMatchSnapshot();
  });
});
