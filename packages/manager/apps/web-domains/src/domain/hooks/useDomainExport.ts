import { v6 } from '@ovh-ux/manager-core-api';
import punycode from 'punycode/punycode';
import { getDomainService } from '@/domain/data/api/domainResources';
import { getDomainContact } from '@/common/data/api/common.api';
import { getServiceDnssec } from '@/domain/data/api/domainZone';
import {
  DomainService,
  NameServer,
  NameServerTypeEnum,
} from '@/domain/types/domainResource';

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
  const fetchAllDomains = async (): Promise<DomainService[]> => {
    try {
      const { data: domainNames } = await v6.get<string[]>('/domain');

      return domainNames.map((domainName) => ({
        domain: domainName,
      })) as DomainService[];
    } catch (error) {
      return [];
    }
  };

  const fetchDomainDetails = async (
    domain: DomainService,
    selection: ExportSelection,
    nichandleInfo?: NichandleInfo,
  ): Promise<Record<string, string>> => {
    const row: Record<string, string> = {};
    if (selection.domainColumns.includes('domain')) {
      row['domain'] = domain.domain || '';
    }
    if (selection.domainColumns.includes('domain-utf8')) {
      row['domain utf-8'] = punycode.toUnicode(domain.domain || '');
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

    const hasFullDomainData = domain?.expirationDate || domain?.lastUpdate;

    let domainDetails = domain;
    if (needsDomainService && !hasFullDomainData) {
      try {
        domainDetails = await getDomainService(domain.domain);
      } catch {
        domainDetails = domain;
      }
    }

    // Domain Services
    if (selection.domainColumns.includes('expiration')) {
      row['expiration'] = domainDetails.expirationDate || '';
    }
    if (selection.domainColumns.includes('creation')) {
      row['creation'] = domainDetails.lastUpdate || '';
    }

    if (selection.domainColumns.includes('dns-server')) {
      row['dns-server'] =
        domainDetails.nameServers
          ?.map((ns: NameServer) => ns.nameServer)
          .join(', ') || '';
    }
    if (selection.domainColumns.includes('dns-type')) {
      row['dns-type'] = domainDetails.nameServerType || '';
    }
    if (selection.domainColumns.includes('dns-anycast')) {
      row['dns-anycast'] = String(
        domainDetails.nameServerType === NameServerTypeEnum.ANYCAST,
      );
    }

    // DNSSEC
    if (selection.domainColumns.includes('dnssec')) {
      try {
        const dnssec = await getServiceDnssec(domainDetails.domain);
        row.DNSSEC = dnssec?.status || '';
      } catch {
        row.DNSSEC = '';
      }
    }

    // Contacts
    if (selection?.contactColumns?.length > 0) {
      const contactPromises = selection.contactColumns.map(
        async (contactType) => {
          const contactFieldMap: Record<string, keyof DomainService> = {
            owner: 'contactOwner',
            admin: 'contactAdmin',
            tech: 'contactTech',
            billing: 'contactBilling',
          };

          const contactField = contactFieldMap[contactType];
          const contactData = domainDetails[contactField] as
            | { id: string }
            | undefined;
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
