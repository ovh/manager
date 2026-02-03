import { describe, it } from 'vitest';

import { Subsidiary } from '@ovh-ux/manager-config';

import { GuideLinks, getOnboardingLinkFor } from '@/pages/onboarding/Onboarding.guides.constants';

describe('Onboarding guides constants', () => {
  const links: GuideLinks = {
    DEFAULT: 'default',
    FR: 'fr',
    CA: 'ca',
  };

  describe('getOnboardingLinkFor', () => {
    it.each([
      {
        subsidiary: 'FR',
        expected: links.FR,
      },
      {
        subsidiary: 'US',
        expected: links.DEFAULT,
      },
    ])('should get $expected for $subsidiary', ({ subsidiary, expected }) => {
      const result = getOnboardingLinkFor(links, subsidiary as Subsidiary);

      expect(result).toEqual(expected);
    });
  });
});
