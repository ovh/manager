import { describe, expect, it } from 'vitest';
import { OvhSubsidiary } from '@ovh-ux/manager-react-components';
import { LegalPolicyLinkByLanguage } from '../../constants/constants';
import { usePrivacyPolicyLink } from './usePrivacyPolicy';

describe('usePrivacyPolicy', () => {
  describe('usePrivacyPolicyLink', () => {
    it.each([
      ['FR', 'anything', LegalPolicyLinkByLanguage.FR],
      ['CA', 'en_CA', LegalPolicyLinkByLanguage.CA.en],
      ['CA', 'fr_CA', LegalPolicyLinkByLanguage.CA.fr],
      ['CA', 'fr_FR', LegalPolicyLinkByLanguage.CA.fr],
      ['CA', 'en_IN', LegalPolicyLinkByLanguage.CA.en],
      ['unknown', 'anything', LegalPolicyLinkByLanguage.DEFAULT],
    ])(
      'should have the correct link for %s user speaking %s',
      async (sub, locale, result) => {
        const link = usePrivacyPolicyLink(sub as OvhSubsidiary, locale);
        expect(link).toBe(result);
      },
    );
  });
});
