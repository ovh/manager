import { OvhSubsidiary } from '@ovh-ux/manager-react-components';
import { LegalPolicyLinkByLanguage } from '../../constants/constants';
import { CanadianPolicyLinks } from '../../types/links.type';

export const usePrivacyPolicyLink = (
  subsidiary: OvhSubsidiary,
  language: string,
): string => {
  const [baseLocale] = language.split('_');

  return subsidiary === 'CA'
    ? LegalPolicyLinkByLanguage.CA[baseLocale as keyof CanadianPolicyLinks] ||
        LegalPolicyLinkByLanguage.CA.en
    : LegalPolicyLinkByLanguage[subsidiary] ||
        LegalPolicyLinkByLanguage.DEFAULT;
};
