import { Region } from '@ovh-ux/manager-config';
import { v2 } from '@ovh-ux/manager-core-api';
import { Setting } from '@/types/settings';
import {
  MockedCASettings,
  MockedEUSettings,
  MockedUSSettings,
} from '../mocks/settings.mock';

export const getSettings = async (region: Region) => {
  // const { data } = await v2.get<Setting[]>(`/account/settings?ovhIS=${region}`);
  console.log(region);
  const data = MockedEUSettings;
  const result = new Map();
  data.forEach((setting) => {
    if (setting.billingCountries?.length) {
      result.set(setting.alpha2Code, setting.billingCountries);
    }
  });
  return result;
};
