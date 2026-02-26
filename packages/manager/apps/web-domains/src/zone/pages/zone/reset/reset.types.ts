export type AType = 'REDIRECTION' | 'HOSTING_WEB' | 'CUSTOM';
export type MxType = 'REDIRECTION' | 'EMAILS' | 'CUSTOM';

export const A_TYPES: AType[] = ['REDIRECTION', 'HOSTING_WEB', 'CUSTOM'];

export interface MxEntry {
  id: string;
  target: string;
  priority: number;
}

export const DEFAULT_MX_ENTRY: MxEntry = {
  id: crypto.randomUUID(),
  target: '',
  priority: 0,
};

export const IPV4_REGEX = /^(\d{1,3}\.){3}\d{1,3}$/;

export const isValidIpv4 = (ip: string) =>
  IPV4_REGEX.test(ip) && ip.split('.').every((part) => Number(part) <= 255);
