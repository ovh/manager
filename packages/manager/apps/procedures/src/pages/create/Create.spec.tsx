import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import Create from '@/pages/create/Create.page';
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
  it('should have the correct link for FR user', async () => {
    const { getByTestId } = render(<Create />);

    const legalInformationContent = getByTestId('legal_information_content');
    expect(legalInformationContent).not.toBeNull();
    expect(
      legalInformationContent.innerHTML.includes(LegalPolicyLinkByLanguage.FR),
    ).toBe(true);
  });

  it('should have the correct link for CA user speaking english', async () => {
    user.subsidiary = 'CA';
    const { getByTestId } = render(<Create />);

    const legalInformationContent = getByTestId('legal_information_content');
    expect(
      legalInformationContent.innerHTML.includes(
        LegalPolicyLinkByLanguage.CA.en_CA,
      ),
    ).toBe(true);
  });

  it('should have the correct link for CA user speaking french', async () => {
    user.language = 'fr_CA';
    const { getByTestId } = render(<Create />);

    const legalInformationContent = getByTestId('legal_information_content');
    expect(
      legalInformationContent.innerHTML.includes(
        LegalPolicyLinkByLanguage.CA.fr_CA,
      ),
    ).toBe(true);
  });

  it('should have the correct link for user with an unknown sub', async () => {
    user.subsidiary = '';
    const { getByTestId } = render(<Create />);

    const legalInformationContent = getByTestId('legal_information_content');
    expect(
      legalInformationContent.innerHTML.includes(
        LegalPolicyLinkByLanguage.DEFAULT,
      ),
    ).toBe(true);
  });
});
