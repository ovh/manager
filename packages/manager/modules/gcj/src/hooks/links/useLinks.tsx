import { OvhSubsidiary } from '@ovh-ux/manager-react-components';

export const useLink = (
  links: Partial<Record<OvhSubsidiary, string>>,
  subsidiary: OvhSubsidiary,
): string => {
  return links[subsidiary] || links.DEFAULT || '';
};
