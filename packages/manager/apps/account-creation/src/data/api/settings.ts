import { Region } from '@ovh-ux/manager-config';
import { v6 } from '@ovh-ux/manager-core-api';
import { Setting } from '@/types/settings';

export const getSettings = async (region: Region) => {
  const { data } = await v6.get<Setting[]>(
    `/newAccount/residentialCountry?ovhIS=${region}`,
  );
  const result = new Map();
  data.forEach((setting) => {
    if (setting.billingCountries?.length) {
      result.set(setting.alpha2Code, setting.billingCountries);
    }
  });
  return result;
};
