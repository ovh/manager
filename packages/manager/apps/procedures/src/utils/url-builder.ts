import { User } from '@/context/User/context';

export const getRedirectLoginUrl = (user: User) => {
  const loginUrl =
    window.location.host === 'www.ovhtelecom.fr'
      ? 'https://www.ovh.com/auth/'
      : '/auth';

  const subsidiaryParams = user?.subsidiary
    ? `?ovhSubsidiary=${user.subsidiary}`
    : '';

  return `${loginUrl}${subsidiaryParams}`;
};

export const getWebSiteRedirectUrl = () => 'https://www.ovhcloud.com';
