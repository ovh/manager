import { TContactsConfiguration } from './domainResource';

export type DomainColumn =
  | 'domain'
  | 'domain-utf8'
  | 'expiration'
  | 'creation'
  | 'dns-server'
  | 'dns-type'
  | 'dns-anycast'
  | 'dnssec';

export type ContactColumn = 'owner' | 'admin' | 'tech' | 'billing';

export interface ExportSelection {
  domainColumns: DomainColumn[];
  contactColumns: ContactColumn[];
}

export type ExportRowData = Record<string, string>;

export const CONTACT_FIELD_MAP: Record<string, keyof TContactsConfiguration> = {
  owner: 'contactOwner',
  admin: 'contactAdministrator',
  tech: 'contactTechnical',
  billing: 'contactBilling',
};

export interface ExportProgress {
  current: number;
  total: number;
  percentage: number;
  phase: 'fetching' | 'processing' | 'generating';
}

export interface ExportResult {
  downloadUrl: string;
  filename: string;
  total: number;
}
