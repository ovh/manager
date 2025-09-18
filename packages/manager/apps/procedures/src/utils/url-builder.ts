import { getAuthUrl } from '@ovh-ux/manager-core-sso';
import { User } from '@/context/User/context';

export const getRedirectLoginUrl = (user: User) => {
  const loginUrl = getAuthUrl();

  const subsidiaryParams = user?.subsidiary
    ? `?ovhSubsidiary=${user.subsidiary}`
    : '';

  return `${loginUrl}${subsidiaryParams}`;
};

export const getWebSiteRedirectUrl = () => 'https://www.ovhcloud.com';
