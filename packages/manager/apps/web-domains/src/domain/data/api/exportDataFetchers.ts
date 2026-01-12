import punycode from 'punycode/punycode';
import { getDomainContact } from '@/common/data/api/common.api';
import { getServiceDnssec } from '@/domain/data/api/domainZone';
import {
  TDomainResource,
  TNameServerWithType,
  DomainService,
} from '@/domain/types/domainResource';
import { DnsConfigurationTypeEnum } from '../../enum/dnsConfigurationType.enum';
import {
  DomainColumn,
  ContactColumn,
  ExportRowData,
  CONTACT_FIELD_MAP,
} from '@/domain/types/export.types';

// Fetches domain-related columns for export
export const fetchDomainColumns = async (
  domain: TDomainResource,
  domainServices: DomainService | undefined,
  selectedColumns: DomainColumn[],
): Promise<ExportRowData> => {
  const row: Record<string, string> = {};

  if (selectedColumns.includes('domain')) {
    row['domain'] = domain.id || '';
  }

  if (selectedColumns.includes('domain-utf8')) {
    row['domain utf-8'] = punycode.toUnicode(domain.id || '');
  }

  if (selectedColumns.includes('expiration')) {
    row['expiration'] = domainServices?.expirationDate || '';
  }

  if (selectedColumns.includes('creation')) {
    row['creation'] = domainServices?.lastUpdate || '';
  }

  if (selectedColumns.includes('dns-server')) {
    row['dns-server'] =
      domain.currentState?.dnsConfiguration?.nameServers
        ?.map((ns: TNameServerWithType) => ns.nameServer)
        .join(', ') || '';
  }

  if (selectedColumns.includes('dns-type')) {
    row['dns-type'] =
      domain.currentState?.dnsConfiguration?.configurationType || '';
  }

  if (selectedColumns.includes('dns-anycast')) {
    row['dns-anycast'] = String(
      domain.currentState?.dnsConfiguration?.configurationType ===
        DnsConfigurationTypeEnum.ANYCAST,
    );
  }

  return row;
};

// Fetches DNSSEC data for a domain
export const fetchDnssecData = async (domainId: string): Promise<string> => {
  try {
    const dnssec = await getServiceDnssec(domainId);
    return dnssec?.status || '';
  } catch {
    return '';
  }
};

// Fetches a single contact information
const fetchSingleContact = async (
  contactId: string,
  contactType: string,
): Promise<string> => {
  if (contactType !== 'owner') {
    return contactId;
  }

  try {
    const contactDetails = await getDomainContact(contactId);
    const details = `${contactDetails?.organisationName ||
      contactDetails?.firstName} ${contactDetails?.lastName} ${Object.values(
      contactDetails?.address,
    )
      .map((v) => v || '')
      .join(' ')} ${contactDetails?.email} ${contactDetails?.phone}`.trim();
    return details || contactId;
  } catch {
    return contactId;
  }
};

// Fetches contact-related columns for export
export const fetchContactColumns = async (
  domain: TDomainResource,
  selectedColumns: ContactColumn[],
): Promise<ExportRowData> => {
  const row: Record<string, string> = {};

  if (!selectedColumns || selectedColumns.length === 0) {
    return row;
  }

  const contactPromises = selectedColumns.map(async (contactType) => {
    const contactField = CONTACT_FIELD_MAP[contactType];
    const contactData = domain?.currentState?.contactsConfiguration[
      contactField
    ] as { id: string } | undefined;
    const contactId = contactData?.id;

    if (!contactId) {
      row[`Contact ${contactType}`] = '';
      return;
    }

    row[`Contact ${contactType}`] = await fetchSingleContact(
      contactId,
      contactType,
    );
  });

  await Promise.all(contactPromises);
  return row;
};
