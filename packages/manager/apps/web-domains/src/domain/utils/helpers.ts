import { DOMAIN } from '@/common/constants';

/**
 * Converts the first character of str to upper case and the remaining to lower case.
 * @param str string to be capitalized
 * @returns capitalized string
 */
export const capitalize = (str: string) => {
  if (!str) {
    return '';
  }
  return `${str.charAt(0).toUpperCase()}${str.slice(1).toLowerCase()}`;
};

export const goToUpdateRenewFrequencyParams = (serviceName: string) => {
  return {
    scope: 'billing',
    target: '/autorenew/services/update',
    params: {
      serviceId: serviceName,
      serviceType: DOMAIN,
    },
  };
};
