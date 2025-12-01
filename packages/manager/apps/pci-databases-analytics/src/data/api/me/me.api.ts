import { ContinentCountryLocation } from '@datatr-ux/ovhcloud-types/me/geolocation';
import { apiClient } from '../api.client';

export const getGeolocation = async () =>
  apiClient.v6.post<ContinentCountryLocation>(`/me/geolocation`);
