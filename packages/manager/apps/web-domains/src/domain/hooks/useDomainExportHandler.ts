import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { download, generateCsv, mkConfig } from 'export-to-csv';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { DomainService } from '@/domain/types/domainResource';
import { useDomainExport } from '@/domain/hooks/useDomainExport';
import { useNichandleInformation } from '@/common/hooks/nichandle/useNichandleInformation';

interface UseExportHandlerParams {
  selectedServiceNames: string[];
  domainResources: DomainService[] | null;
  setExportProgress: (
    progress: { current: number; total: number; percentage: number } | null,
  ) => void;
  setExportDone: (
    done: { filename: string; downloadUrl: string; total: number } | null,
  ) => void;
  setIsDrawerExportOpen?: (open: boolean) => void;
}

export const useDomainExportHandler = ({
  selectedServiceNames,
  domainResources,
  setExportProgress,
  setExportDone,
  setIsDrawerExportOpen,
}: UseExportHandlerParams): {
  handleExport: (selection: {
    domainColumns: string[];
    contactColumns: string[];
  }) => Promise<void>;
} => {
  const { t } = useTranslation(['domain', 'web-domains/error']);
  const { addError } = useNotifications();
  const { fetchDomainDetails, fetchAllDomains } = useDomainExport();
  const { nichandleInformation } = useNichandleInformation();

  const handleExport = useCallback(
    async (selection: {
      domainColumns: string[];
      contactColumns: string[];
    }) => {
      setIsDrawerExportOpen?.(false);

      try {
        if (
          !selection ||
          !selection.domainColumns ||
          !selection.contactColumns
        ) {
          throw new Error('Invalid selection');
        }

        let domainsToExport: DomainService[] = [];

        if (selectedServiceNames.length === 0) {
          setExportProgress({
            current: 0,
            total: 0,
            percentage: 0,
          });

          const data = await fetchAllDomains();
          domainsToExport = data.length > 0 ? data : domainResources || [];
        } else {
          domainsToExport = (domainResources || []).filter((domain) =>
            selectedServiceNames.includes(domain.domain),
          );
        }

        if (domainsToExport.length === 0) {
          setExportProgress(null);
          addError(
            t('domain_export_error_no_domains', 'No domains to export'),
            true,
          );
          return;
        }

        const totalDomains = domainsToExport.length;

        setExportProgress({
          current: 0,
          total: totalDomains,
          percentage: 0,
        });

        const exportData: Array<Record<string, string>> = [];
        let processedCount = 0;
        const BATCH_SIZE = 20;

        const batches = [];
        for (let i = 0; i < domainsToExport.length; i += BATCH_SIZE) {
          batches.push(domainsToExport.slice(i, i + BATCH_SIZE));
        }

        await batches.reduce(async (previousPromise, batch) => {
          await previousPromise;

          const batchResults = await Promise.all(
            batch.map((domain) => fetchDomainDetails(domain, selection)),
          );

          exportData.push(...batchResults);
          processedCount += batch.length;

          const percentage = Math.round((processedCount / totalDomains) * 100);
          setExportProgress({
            current: processedCount,
            total: totalDomains,
            percentage,
          });
        }, Promise.resolve());

        setExportProgress(null);

        const csvConfig = mkConfig({
          filename: `domains_export_${new Date().toISOString().split('T')[0]}`,
          fieldSeparator: ',',
          quoteStrings: true,
          useKeysAsHeaders: true,
        });

        const csv = generateCsv(csvConfig)(exportData);
        download(csvConfig)(csv);

        const csvString = typeof csv === 'string' ? csv : csv.toString();
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const downloadUrl = URL.createObjectURL(blob);
        const filename = `${csvConfig.filename}.csv`;

        setExportDone({
          downloadUrl,
          filename,
          total: totalDomains,
        });
      } catch (exportError) {
        setExportProgress(null);
        addError(
          t('domain_export_error', { error: (exportError as Error).message }),
          true,
        );
      }
    },
    [
      selectedServiceNames,
      domainResources,
      setExportProgress,
      setExportDone,
      setIsDrawerExportOpen,
      fetchDomainDetails,
      fetchAllDomains,
      t,
      addError,
    ],
  );

  return { handleExport };
};
