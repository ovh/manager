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

export type DnsRecord = {
  fieldType: string;
  target: string;
  subDomain?: string;
};

/**
 * Reset DNS zone
 */
export const resetZone = async (
  zoneName: string,
  minimized: boolean,
  dnsRecords: DnsRecord[] | null,
): Promise<void> => {
  await v6.post(`/domain/zone/${zoneName}/reset`, {
    minimized,
    ...(dnsRecords?.length ? { DnsRecords: dnsRecords } : {}),
  });
};

export type THostingDetails = {
  hostingIp: string;
};

export const getHostings = async (): Promise<string[]> => {
  const { data } = await v6.get('/hosting/web');
  return data;
};

export const getHostingDetails = async (hosting: string): Promise<THostingDetails> => {
  const { data } = await v6.get<THostingDetails>(`/hosting/web/${hosting}`);
  return data;
};

export type TEmailDomain = {
  offer: string;
};

export const getEmailDomain = async (domain: string): Promise<TEmailDomain> => {
  const { data } = await v6.get<TEmailDomain>(`/email/domain/${domain}`);
  return data;
};

export const getEmailRecommendedDNSRecords = async (domain: string): Promise<DnsRecord[]> => {
  const { data } = await v6.get<DnsRecord[]>(`/email/domain/${domain}/recommendedDNSRecords`);
  return data;
};

/**
 * Export DNS zone as text
 */
export const exportDnsZoneText = async (
  zoneName: string,
): Promise<string> => {
  const { data } = await v6.get<string>(`/domain/zone/${zoneName}/export`);
  return data;
};

/**
 * Import DNS zone from text
 */
export const importDnsZoneText = async (
  zoneName: string,
  zoneFile: string,
): Promise<void> => {
  await v6.post(`/domain/zone/${zoneName}/import`, {
    zoneFile,
  });
};
