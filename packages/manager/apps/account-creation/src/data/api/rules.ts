import { v6 } from '@ovh-ux/manager-core-api';
import { Country, UserLocales } from '@ovh-ux/manager-config';

import { Rule } from '@/types/rule';
import { Subsidiary } from '@/types/subsidiary';

export type RulesParam = {
  country?: Country;
  language?: UserLocales;
  phoneCountry?: Country;
  phoneType?: 'landline' | 'mobile';
  ovhSubsidiary?: Subsidiary;
  legalform?:
    | 'administration'
    | 'association'
    | 'corporation'
    | 'individual'
    | 'personalcorporation';
};

/**
 *  Get account creation rules
 */
export const getRules = async (params: RulesParam) => {
  const { data, status } = await v6.post<Array<Rule>>(
    `/newAccount/rules`,
    params,
  );
  if (status !== 200) {
    throw new Error('Failed to get account creation rules');
  }
  return data.reduce((acc, rule) => {
    if (rule.fieldName) {
      acc[rule.fieldName] = rule;
    }
    return acc;
  }, {} as Record<string, Rule>);
};
