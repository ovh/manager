import { v6 } from "@ovh-ux/manager-core-api";
import { Preference } from '@/types/preferences';

export const fetchPreferences = async (preference: string): Promise<any | null> => {
  try {
    const {data} = await v6.get<Preference>(`/me/preferences/manager/${preference}`);
    return data?.value ? JSON.parse(data.value) : null;
  }
  catch (e) {
    if (e.response?.status === 404) {
      return null;
    }
    throw e;
  }
}
