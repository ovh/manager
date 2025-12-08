import { VRACK_WEB_PAGE_LINKS } from '@/utils/constants';

import { useGetUser } from './useGetUser';

export const useWebPageLink = (): string | null => {
  const { user } = useGetUser();
  const subsidiary = user?.ovhSubsidiary as keyof typeof VRACK_WEB_PAGE_LINKS;
  return subsidiary && VRACK_WEB_PAGE_LINKS[subsidiary] ? VRACK_WEB_PAGE_LINKS[subsidiary] : null;
};
