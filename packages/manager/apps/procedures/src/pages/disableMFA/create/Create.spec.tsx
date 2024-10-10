import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import Create from '@/pages/disableMFA/create/Create.page';
import { LegalPolicyLinkByLanguage } from '@/constants';

const user = {
  legalForm: 'other',
  subsidiary: 'FR',
  language: 'en_CA',
};

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (translationKey: string, args: any) =>
      `${translationKey} ${JSON.stringify(args)}`,
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

describe('Create.page', () => {
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
      const { getByTestId } = render(<Create />);

      const legalInformationContent = getByTestId('legal_information_content');
      expect(legalInformationContent.innerHTML.includes(result)).toBe(true);
    },
  );
});
