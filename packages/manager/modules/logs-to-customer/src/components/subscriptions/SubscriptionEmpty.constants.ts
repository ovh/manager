import { CountryCode } from '@ovh-ux/manager-config';

type KnowMoreLinks = { [key in CountryCode]: string };

export const KNOW_MORE_BASE_URL: Record<string, string> = {
  EU: 'https://www.ovhcloud.com',
  US: 'https://us.ovhcloud.com/',
};

export const KNOW_MORE_LIST: Partial<KnowMoreLinks> = {
  ASIA: '/asia/identity-security-operations/logs-data-platform/',
  AU: '/en-au/identity-security-operations/logs-data-platform/',
  CA: '/en-ca/identity-security-operations/logs-data-platform/',
  DE: '/de/identity-security-operations/logs-data-platform/',
  ES: '/es-es/identity-security-operations/logs-data-platform/',
  FR: '/fr/identity-security-operations/logs-data-platform/',
  GB: '/en-gb/identity-security-operations/logs-data-platform/',
  IE: '/en-ie/identity-security-operations/logs-data-platform/',
  IT: '/it/identity-security-operations/logs-data-platform/',
  IN: '/en-in/identity-security-operations/logs-data-platform/',
  PL: '/pl/identity-security-operations/logs-data-platform/',
  PT: '/pt/identity-security-operations/logs-data-platform/',
  QC: '/fr-ca/identity-security-operations/logs-data-platform/',
  SG: '/en-sg/identity-security-operations/logs-data-platform/',
  US: '/identity-security-operations/logs-data-platform/',
  WE: '/en/identity-security-operations/logs-data-platform/',
  WS: '/es/identity-security-operations/logs-data-platform/',
  MA: '/fr/identity-security-operations/logs-data-platform/',
  SN: '/fr/identity-security-operations/logs-data-platform/',
  TN: '/fr/identity-security-operations/logs-data-platform/',
};
