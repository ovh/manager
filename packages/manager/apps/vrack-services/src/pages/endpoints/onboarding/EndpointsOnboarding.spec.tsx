import { describe, it } from 'vitest';
import { assertTextVisibility } from '@ovh-ux/manager-core-test-utils';
import React from 'react';
import { labels, renderTestComponent } from '@/test-utils';
import EndpointsOnboarding from './EndpointsOnboarding.page';

describe('EndpointsOnboarding', () => {
  it('should display the endpoints onboarding', async () => {
    await renderTestComponent({
      nbVs: 1,
      component: <EndpointsOnboarding />,
    });
    await assertTextVisibility(labels.endpoints.endpointsOnboardingTitle);
  });
});
