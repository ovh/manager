import { useTranslation } from 'react-i18next';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import { useMutation } from '@tanstack/react-query';
import { TRANSLATION_NAMESPACES } from '@/utils';
import { getIpExport, GetIpListParams } from '../api';

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
    const result = await getIpExport({
      ...apiFilter,
      serviceName: apiFilter['routedTo.serviceName'],
    });

    const resultLength = result?.data?.length ?? 0;
    if (resultLength > 0) {
      const csvConfig = mkConfig({
        filename: 'export_ips',
        fieldSeparator: ',',
        quoteStrings: true,
        decimalSeparator: '.',
        useKeysAsHeaders: true,
      });

      const csvData = result.data.map((item: ExportIpToCsvData) => ({
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

  return useMutation({
    mutationFn: handleExportToCsv,
    onSuccess,
    onError,
  });
};
