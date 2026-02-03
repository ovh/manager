import { getDomainService } from '@/domain/data/api/domainResources';
import { TDomainResource, DomainService } from '@/domain/types/domainResource';
import {
  fetchDomainColumns,
  fetchContactColumns,
  fetchDnssecData,
} from '@/domain/data/api/exportDataFetchers';
import { ExportSelection, ExportRowData } from '@/domain/types/export.types';
import { v2 } from '@ovh-ux/manager-core-api';

export const useDomainExport = () => {
  const fetchAllDomains = async (
    onProgress?: (current: number, total?: number) => void,
  ): Promise<TDomainResource[]> => {
    try {
      const allDomains: TDomainResource[] = [];
      let cursor: string | undefined;
      let totalCount: number | undefined;

      do {
        const response = await v2.get<TDomainResource[]>('/domain/name', {
          headers: {
            'X-Pagination-Size': '1000',
            ...(cursor ? { 'X-Pagination-Cursor': cursor } : {}),
          },
        });

        if (!totalCount) {
          const totalHeader = response.headers['x-pagination-elements'];
          totalCount = totalHeader
            ? parseInt(totalHeader as string, 10)
            : undefined;
        }

        const page = response.data;
        allDomains.push(...page);
        onProgress?.(allDomains.length, totalCount);

        cursor = response.headers['x-pagination-cursor-next'] as
          | string
          | undefined;
      } while (cursor);

      return allDomains;
    } catch (error) {
      return [];
    }
  };

  const fetchDomainDetails = async (
    domain: TDomainResource,
    selection: ExportSelection,
  ): Promise<ExportRowData> => {
    const needsExpiration = selection.domainColumns.includes('expiration');
    const needsContacts = selection?.contactColumns?.length > 0;
    const needsOtherDetails =
      selection.domainColumns.includes('creation') ||
      selection.domainColumns.includes('dns-server') ||
      selection.domainColumns.includes('dns-anycast') ||
      selection.domainColumns.includes('dns-type');

    const needsDomainService =
      needsExpiration || needsContacts || needsOtherDetails;

    let domainServices: DomainService | undefined;
    if (needsDomainService) {
      try {
        domainServices = await getDomainService(domain.id);
      } catch {
        // Silent failure - will use domain data as fallback
      }
    }

    const [domainData, contactData, dnssecStatus] = await Promise.all([
      fetchDomainColumns(domain, domainServices, selection.domainColumns),
      fetchContactColumns(domain, selection.contactColumns),
      selection.domainColumns.includes('dnssec')
        ? fetchDnssecData(domain.id)
        : Promise.resolve(''),
    ]);

    const row: ExportRowData = {
      ...domainData,
      ...contactData,
    };

    if (selection.domainColumns.includes('dnssec')) {
      row.DNSSEC = dnssecStatus;
    }

    return row;
  };

  return { fetchDomainDetails, fetchAllDomains };
};
