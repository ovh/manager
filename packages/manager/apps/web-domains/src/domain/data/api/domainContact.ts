import { v6 } from '@ovh-ux/manager-core-api';
import { TDomainContact } from '@/common/types/common.types';

/**
 *  : Get Contact holder attached to Domain name
 */
export const getDomainContact = async (
  contactID: string,
): Promise<TDomainContact> => {
  const { data } = await v6.get(`/domain/contact/${contactID}`);
  return data;
};
