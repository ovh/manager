import { v2, v6 } from '@ovh-ux/manager-core-api';
import punycode from 'punycode/punycode';
import { getDomainService } from '@/domain/data/api/domainResources';
import { getDomainContact } from '@/common/data/api/common.api';
import { getServiceDnssec } from '@/domain/data/api/domainZone';
import {
  DomainService,
  NameServer,
  NameServerTypeEnum,
  TContactsConfiguration,
  TDomainResource,
  TNameServerWithType,
} from '@/domain/types/domainResource';
import { DnsConfigurationTypeEnum } from '../enum/dnsConfigurationType.enum';
import { getDomainResource } from '../data/api/domainResources';

interface ExportSelection {
  domainColumns: string[];
  contactColumns: string[];
}

interface NichandleInfo {
  nichandle?: string;
  name?: string;
  firstname?: string;
  organisation?: string;
}

export const useDomainExport = () => {
  const fetchAllDomains = async (): Promise<TDomainResource[]> => {
    try {
      const { data: domainNames } = await v6.get<string[]>('/domain/name');

      return domainNames.map((domainName) => ({
        id: domainName,
      })) as TDomainResource[];
    } catch (error) {
      return [];
    }
  };

  const fetchDomainDetails = async (
    domain: TDomainResource,
    selection: ExportSelection,
    nichandleInfo?: NichandleInfo,
  ): Promise<Record<string, string>> => {
    const row: Record<string, string> = {};
    if (selection.domainColumns.includes('domain')) {
      row['domain'] = domain.id || '';
    }
    if (selection.domainColumns.includes('domain-utf8')) {
      row['domain utf-8'] = punycode.toUnicode(domain.id || '');
    }

    const needsExpiration = selection.domainColumns.includes('expiration');
    const needsContacts = selection?.contactColumns?.length > 0;
    const needsOtherDetails =
      selection.domainColumns.includes('creation') ||
      selection.domainColumns.includes('dns-server') ||
      selection.domainColumns.includes('dns-anycast') ||
      selection.domainColumns.includes('dns-type');

    const needsDomainService =
      needsExpiration || needsContacts || needsOtherDetails;

    const hasFullDomainData = domain?.currentState.createdAt;

    let domainDetails = domain;
    let domainServices;
    if (needsDomainService && !hasFullDomainData) {
      try {
        domainDetails = await getDomainResource(domain.id);
        domainServices = await getDomainService(domain.id);
      } catch {
        domainDetails = domain;
      }
    }

    // Domain Services
    if (selection.domainColumns.includes('expiration')) {
      row['expiration'] = domainServices.expirationDate || '';
    }
    if (selection.domainColumns.includes('creation')) {
      row['creation'] = domainServices.lastUpdate || '';
    }

    if (selection.domainColumns.includes('dns-server')) {
      row['dns-server'] =
        domainDetails.currentState?.dnsConfiguration?.nameServers
          ?.map((ns: TNameServerWithType) => ns.nameServer)
          .join(', ') || '';
    }
    if (selection.domainColumns.includes('dns-type')) {
      row['dns-type'] =
        domainDetails.currentState?.dnsConfiguration?.configurationType || '';
    }
    if (selection.domainColumns.includes('dns-anycast')) {
      row['dns-anycast'] = String(
        domainDetails.currentState?.dnsConfiguration?.configurationType ===
          DnsConfigurationTypeEnum.ANYCAST,
      );
    }

    // DNSSEC
    if (selection.domainColumns.includes('dnssec')) {
      try {
        const dnssec = await getServiceDnssec(domainDetails.id);
        row.DNSSEC = dnssec?.status || '';
      } catch {
        row.DNSSEC = '';
      }
    }

    // Contacts
    if (selection?.contactColumns?.length > 0) {
      const contactPromises = selection.contactColumns.map(
        async (contactType) => {
          const contactFieldMap: Record<
            string,
            keyof TContactsConfiguration
          > = {
            owner: 'contactOwner',
            admin: 'contactAdministrator',
            tech: 'contactTechnical',
            billing: 'contactBilling',
          };

          const contactField = contactFieldMap[contactType];
          const contactData = domainDetails?.currentState
            ?.contactsConfiguration[contactField] as { id: string } | undefined;
          const contactId = contactData?.id;

          if (!contactId) {
            row[`Contact ${contactType}`] = '';
            return;
          }

          if (contactType === 'owner') {
            try {
              const contactDetails = await getDomainContact(contactId);
              const details = `${contactDetails?.organisationName ||
                contactDetails?.firstName} ${
                contactDetails?.lastName
              } ${Object.values(contactDetails?.address)
                .map((v) => v || '')
                .join(' ')} ${contactDetails?.email} ${
                contactDetails?.phone
              }`.trim();
              row[`Contact ${contactType}`] = details || contactId;
            } catch {
              row[`Contact ${contactType}`] = contactId;
            }
            return;
          }

          if (nichandleInfo?.nichandle === contactId) {
            const details =
              nichandleInfo.organisation ||
              `${nichandleInfo.name || ''} ${nichandleInfo.firstname ||
                ''}`.trim();
            row[`Contact ${contactType}`] = details || contactId;
          } else {
            row[`Contact ${contactType}`] = contactId;
          }
        },
      );

      await Promise.all(contactPromises);
    }

    return row;
  };

  return { fetchDomainDetails, fetchAllDomains };
};
