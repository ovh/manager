import { v6 } from '@ovh-ux/manager-core-api';
import { TZoneHistory } from '@/zone/types/history.types';

/**
 * Get the list of zone history dates
 */
export const getZoneHistory = async (
  zoneName: string,
): Promise<string[]> => {
  const { data } = await v6.get(`/domain/zone/${zoneName}/history`);
  return data;
};

/**
 * Get zone data for a specific date
 */
export const getZoneHistoryByDate = async (
  zoneName: string,
  creationDate: string,
): Promise<TZoneHistory> => {
  const { data } = await v6.get(
    `/domain/zone/${zoneName}/history/${encodeURIComponent(creationDate)}`,
  );
  return data;
};

/**
 * Download zone file content from URL
 */
export const downloadZoneFile = async (url: string): Promise<string> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download zone file: ${response.statusText}`);
  }
  return response.text();
};

/**
 * Restore zone from history
 */
export const restoreZone = async (
  zoneName: string,
  creationDate: string,
): Promise<void> => {
  await v6.post(`/domain/zone/${zoneName}/import`, {
    zoneFile: creationDate,
  });
};

export type TZoneSoa = {
  ttl: number;
  email: string;
  expire: number;
  nxDomainTtl: number;
  refresh: number;
  retry: number;
  serial: number;
  server: string;
};

/**
 * Get DNS zone SOA
 */
export const getZoneSoa = async (zoneName: string): Promise<TZoneSoa> => {
  const { data } = await v6.get<TZoneSoa>(`/domain/zone/${zoneName}/soa`);
  return data;
};

/**
 * Update DNS zone SOA
 */
export const updateZoneSoa = async (
  zoneName: string,
  soa: TZoneSoa,
): Promise<void> => {
  await v6.put(`/domain/zone/${zoneName}/soa`, soa);
};
