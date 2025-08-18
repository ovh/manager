import { describe, expect, it } from 'vitest';

import { ONBOARDING_CONFIG } from '@/App.constants';

import { getOnboardingConfig } from './Onboarding.api';

describe('getOnboardingConfig', () => {
  it('returns onboarding config', async () => {
    const res = await getOnboardingConfig();
    expect(res).toEqual(ONBOARDING_CONFIG);
  });
});
