import { describe, expect, it } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { assertTextVisibility } from '@ovh-ux/manager-core-test-utils';
import { labels, renderTest } from '../../test-utils';

describe('Vrack Services listing test suite', () => {
  it('should redirect to the onboarding page when the VRS list is empty', async () => {
    await renderTest({ nbVs: 0 });

    await assertTextVisibility(labels.onboarding.onboardingPageTitle);
  });
});
