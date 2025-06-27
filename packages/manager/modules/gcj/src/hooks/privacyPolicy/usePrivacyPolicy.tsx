import { OvhSubsidiary } from '@ovh-ux/manager-react-components';
import { LegalPolicyLinkByLanguage } from '../../constants/constants';
import { CanadianPolicyLinks } from '../../types/links.type';
import { useLink } from '../links/useLinks';

export const usePrivacyPolicyLink = (
  subsidiary: OvhSubsidiary,
  language: string,
): string => {
  const [baseLocale] = language.split('_');
  const { CA: linksForCA, ...linksWithoutCA } = LegalPolicyLinkByLanguage;
  const link = useLink(linksWithoutCA, subsidiary);

  return subsidiary === 'CA'
    ? linksForCA[baseLocale as keyof CanadianPolicyLinks] || linksForCA.en
    : link;
};
