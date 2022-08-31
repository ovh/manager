import apiClient from '@/api/client';

export enum SupportLevelEnum {
  BUSINESS = 'business',
  ENTERPRISE = 'enterprise',
  PREMIUM = 'premium',
  PREMIUM_ACCREDITED = 'premium-accredited',
  STANDARD = 'standard',
}

export type SupportLevel = {
  level: SupportLevelEnum;
};

export async function getSupportLevel(): Promise<SupportLevel> {
  const response = await fetch(`/engine/api/me/supportLevel`);
  return response.json();
}

export async function getSupportTicketIdsByServiceName(
  serviceName: string,
): Promise<number[]> {
  const { data } = await apiClient.v6.get(
    `/support/tickets?serviceName=${serviceName}`,
  );
  return data;
}

export default SupportLevel;
