import { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { aapi } from '@ovh-ux/manager-core-api';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import { ListingContext } from '@/pages/listing/listingContext';
import { ExportIpToCsvData } from '@/data/api';
import { TRANSLATION_NAMESPACES } from '@/utils';

const exportColumns = [
  {
    label: 'IP Block',
    getValue: (item: ExportIpToCsvData) => item.ipBlock,
  },
  {
    label: 'Version',
    getValue: (item: ExportIpToCsvData) => item.version,
  },
  {
    label: 'Type',
    getValue: (item: ExportIpToCsvData) => item.type,
  },
  {
    label: 'Country',
    getValue: (item: ExportIpToCsvData) => item.country || '',
  },
  {
    label: 'Service Name',
    getValue: (item: ExportIpToCsvData) => item.routedTo?.serviceName || '',
  },
  {
    label: 'Description',
    getValue: (item: ExportIpToCsvData) => item.description || '',
  },
];

export const useExportToCsv = () => {
  const { t } = useTranslation([TRANSLATION_NAMESPACES.exportIpToCsv]);
  const { apiFilter, ipToSearch } = useContext(ListingContext);
  const { addSuccess, addError } = useNotifications();
  const [isCSVLoading, setIsCSVLoading] = useState(false);

  const handleExportToCsv = async () => {
    setIsCSVLoading(true);
    try {
      const result = await aapi
        .get('/ipsexportcsv', {
          params: {
            ...apiFilter,
            serviceName: apiFilter['routedTo.serviceName'],
            ip: ipToSearch,
          },
        })
        .then(({ data }) => data);

      if (result && result?.data && result?.data.length > 0) {
        const csvConfig = mkConfig({
          filename: 'export_ips',
          fieldSeparator: ',',
          quoteStrings: true,
          decimalSeparator: '.',
          useKeysAsHeaders: true,
        });

        const csvData = result.data.map((item: ExportIpToCsvData) =>
          exportColumns.reduce(
            (acc, column) => ({
              ...acc,
              [column.label]: column.getValue(item),
            }),
            {},
          ),
        );

        const csv = generateCsv(csvConfig)(csvData);
        download(csvConfig)(csv);
        addSuccess(t('exportIpToCsvSuccess'));
      } else {
        addError(t('exportIpToCsvError'));
      }
    } catch (error) {
      addError(t('exportIpToCsvError'));
    } finally {
      setIsCSVLoading(false);
    }
  };

  return {
    isCSVLoading,
    handleExportToCsv,
  };
};
