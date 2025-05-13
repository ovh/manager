import { render } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import React from 'react';
import { LegalInformations } from './LegalInformations.component';
import { LegalPolicyLinkByLanguage } from '@/constants';

const faketTranslationNamespace = 'tkey';
const faketpolicyTanslationKey = 'policyKey';
const faketinformationTranslationKey = 'informationKey';

const user = {
  legalForm: 'other',
  subsidiary: 'FR',
  language: 'en_CA',
};

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (translationKey: string, args: any) =>
      args ? `${translationKey} ${JSON.stringify(args)}` : translationKey,
    i18n: {
      language: user.language,
    },
  }),
}));

vi.mock('@/context/User/useUser', () => ({
  default: () => ({
    user,
  }),
}));

describe('LegalInformations.component', () => {
  it('should renders the legal information', () => {
    const { getByText } = render(
      <LegalInformations
        translationNamespace={faketTranslationNamespace}
        policyTanslationKey={faketpolicyTanslationKey}
        informationTranslationKey={faketinformationTranslationKey}
      />,
    );

    const legalInfoElement = getByText(faketinformationTranslationKey);
    expect(legalInfoElement).toBeInTheDocument();
  });

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
      user.subsidiary = sub;
      user.language = locale;

      const { getByTestId } = render(
        <LegalInformations
          translationNamespace={faketTranslationNamespace}
          policyTanslationKey={faketpolicyTanslationKey}
          informationTranslationKey={faketinformationTranslationKey}
        />,
      );

      const legalInformationPolicyContent = getByTestId(
        'legal_information_policy_content',
      );
      expect(legalInformationPolicyContent.innerHTML.includes(result)).toBe(
        true,
      );
    },
  );
});
