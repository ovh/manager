import { Universe } from '@/common/enum/common.enum';
import { LifecycleCurrentStateEnum } from '@/common/enum/common.enum';
import { TServiceInfo } from '@/common/types/common.types';

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

export const goToUpdateRenewFrequencyParams = (
  serviceName: string,
  universe: Universe,
) => {
  return {
    scope: 'billing',
    target: '/autorenew/services/update',
    params: {
      serviceId: serviceName,
      serviceType: universe,
    },
  };
};

export const isServiceInCreation = (service: TServiceInfo) =>
  service?.billing?.lifecycle?.current?.state ===
  LifecycleCurrentStateEnum.InCreation;
