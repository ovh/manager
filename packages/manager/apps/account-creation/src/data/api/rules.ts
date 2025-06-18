import { v6 } from '@ovh-ux/manager-core-api';
import { Country, UserLocales } from '@ovh-ux/manager-config';

export type GetRulesParams = {
  /** selected country */
  country: Country | null;
  /** selected language */
  language: UserLocales | null;
};
/**
 *  Get account creation rules
 */
export const getRules = async ({ country, language }: GetRulesParams) => {
  const { data, status } = await v6.post(`/newAccount/rules`, {
    country,
    language,
  });
  if (status > 400) {
    throw new Error();
  }
  return { data, status };
};
