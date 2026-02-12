import { v6 } from '@ovh-ux/manager-core-api';
import { TDomainContact } from '@/common/types/common.types';
import { TConfigurationRule } from '@/domain/types/contactEdit';

/**
 *  : Get Contact holder attached to Domain name
 */
export const getDomainContact = async (
  contactID: string,
): Promise<TDomainContact> => {
  const { data } = await v6.get(`/domain/contact/${contactID}`);
  return data;
};

export const getDomainConfigurationRule = async (
  action: string,
  domain: string,
): Promise<TConfigurationRule> => {
  const { data } = await v6.get(
    `/domain/configurationRule?action=${action}&domain=${domain}`,
  );
  return data;
};

export const postDomainConfigurationRuleCheck = async (
  action: string,
  domain: string,
  params: { owner: Partial<TDomainContact> },
): Promise<void> => {
  const { data } = await v6.post(
    `/domain/configurationRule/check?action=${action}&domain=${domain}`,
    params,
  );
  return data;
};

export const putDomainContact = async (
  contactID: string,
  params: Partial<TDomainContact>,
): Promise<TDomainContact> => {
  const { data } = await v6.put(`/domain/contact/${contactID}`, params);
  return data;
};
