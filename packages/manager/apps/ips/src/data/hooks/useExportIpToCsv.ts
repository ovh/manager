import { useMutation } from '@tanstack/react-query';
import { download, generateCsv, mkConfig } from 'export-to-csv';
import ipaddr from 'ipaddr.js';
import { useTranslation } from 'react-i18next';

import { ApiError } from '@ovh-ux/manager-core-api';

import { TRANSLATION_NAMESPACES } from '@/utils';

import { GetIpListParams, getIpExport } from '../api';

export interface ExportIpToCsvData {
  ipBlock: string;
  version: string;
  type: string;
  country: string | null;
  routedTo: {
    serviceName: string;
  };
  description: string | null;
}

export type ExportIpMutationData = {
  downloadFn?: () => void;
};

/**
 * Checks if an IP address is a complete (valid) IPv4 or IPv6 address
 * For IPv4: Must have exactly 4 octets and be valid
 * For IPv6: Must be a valid complete IPv6 address
 */
const isCompleteIp = (ip: string): boolean => {
  // Check if it's a valid IPv4 with exactly 4 octets
  if (ip.split('.').length === 4) {
    return ipaddr.IPv4.isValid(ip);
  }
  // Check if it's a valid IPv6
  return ipaddr.IPv6.isValid(ip);
};

export const useExportIpToCsv = ({
  apiFilter,
  onSuccess,
  onError,
}: {
  apiFilter: GetIpListParams;
  onSuccess?: (data: ExportIpMutationData) => void;
  onError?: () => void;
}) => {
  const { t } = useTranslation(TRANSLATION_NAMESPACES.exportIpToCsv);
  const handleExportToCsv = async (): Promise<ExportIpMutationData> => {
    // Extract ip from apiFilter to check if it's partial
    const { ip, ...apiFilterWithoutIp } = apiFilter;
    const isPartialIp = ip && !isCompleteIp(ip);

    // Prepare API call parameters
    // If ip is partial, exclude it from the API call
    const apiParams = {
      ...(isPartialIp ? apiFilterWithoutIp : apiFilter),
      serviceName:
        apiFilter['routedTo.serviceName'] === null
          ? '_PARK'
          : apiFilter['routedTo.serviceName'],
    };

    const result = await getIpExport(apiParams);

    // Filter results client-side if ip is partial
    let filteredData = result?.data ?? [];
    if (isPartialIp && ip) {
      filteredData = filteredData.filter((item: ExportIpToCsvData) =>
        item.ipBlock.includes(ip),
      );
    }

    const resultLength = filteredData.length;
    if (resultLength > 0) {
      const csvConfig = mkConfig({
        filename: 'export_ips',
        fieldSeparator: ',',
        quoteStrings: true,
        decimalSeparator: '.',
        useKeysAsHeaders: true,
      });

      const csvData = filteredData.map((item: ExportIpToCsvData) => ({
        [t('exportIpToCsvHeaderIpBlock')]: item.ipBlock,
        [t('exportIpToCsvHeaderVersion')]: item.version,
        [t('exportIpToCsvHeaderType')]: item.type,
        [t('exportIpToCsvHeaderCountry')]: item.country || '',
        [t('exportIpToCsvHeaderServiceName')]: item.routedTo?.serviceName || '',
        [t('exportIpToCsvHeaderDescription')]: item.description || '',
      }));

      const csv = generateCsv(csvConfig)(csvData);
      return { downloadFn: () => download(csvConfig)(csv) };
    }
    throw new Error('No valid CSV could be downloaded');
  };

  return useMutation<ExportIpMutationData, ApiError>({
    mutationFn: handleExportToCsv,
    onSuccess,
    onError,
  });
};
