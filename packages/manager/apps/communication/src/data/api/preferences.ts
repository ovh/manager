import apiClient, { ApiError } from "@ovh-ux/manager-core-api";
import { MePreferences } from "../types/me-preferences.type";

export const getMePreferencesQueryKey = (preferenceKey: string) => [
  `/me/preferences/manager/${preferenceKey}`,
];

export const getMePreferences = async (preferenceKey: string): Promise<boolean> => {
  try {
    const { data } = await apiClient.v6.get<MePreferences>(
      `/me/preferences/manager/${preferenceKey}`,
    );
    return data.value ? data.value.toLowerCase() === 'true' : false;
  } catch (error) {
    if ((error as ApiError).status == 404) {
      return false;
    }
    throw error;
  }
};

export const addMePreferences = async (preferenceKey: string, value: boolean) => apiClient.v6.post<MePreferences>(
  `/me/preferences/manager`,
  {
    key: preferenceKey,
    value: value.toString(),
  },
);
