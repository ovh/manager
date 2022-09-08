import apiClient from '@/api/client';

export async function getSshKeys(): Promise<string[]> {
  const { data } = await apiClient.v6.get(`/me/sshKey`);
  return data;
}

export type Geolocation = {
  continent: string;
  countryCode: string;
  ip: string;
};

export async function getGeolocation(): Promise<Geolocation> {
  const { data } = await apiClient.v6.post(`/me/geolocation`);
  return data;
}
