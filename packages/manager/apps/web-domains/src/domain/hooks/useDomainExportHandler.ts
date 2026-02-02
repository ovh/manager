import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { TDomainResource } from '@/domain/types/domainResource';
import { useDomainExport } from '@/domain/hooks/useDomainExport';
import {
  selectDomainsToExport,
  processBatch,
  generateAndDownloadCsv,
} from '@/domain/utils/exportHelpers';
import {
  ExportProgress,
  ExportResult,
  ExportSelection,
} from '@/domain/types/export.types';

interface UseExportHandlerParams {
  exportAllServices: boolean;
  selectedServiceNames: string[];
  domainResources: TDomainResource[] | null;
  setExportProgress: (progress: ExportProgress | null) => void;
  setExportDone: (done: ExportResult | null) => void;
  setIsDrawerExportOpen?: (open: boolean) => void;
}

export const useDomainExportHandler = ({
  exportAllServices,
  selectedServiceNames,
  domainResources,
  setExportProgress,
  setExportDone,
  setIsDrawerExportOpen,
}: UseExportHandlerParams): {
  handleExport: (selection: ExportSelection) => Promise<void>;
} => {
  const { t } = useTranslation(['domain', 'web-domains/error']);
  const { addError } = useNotifications();
  const { fetchDomainDetails, fetchAllDomains } = useDomainExport();

  const handleExport = useCallback(
    async (selection: ExportSelection) => {
      setIsDrawerExportOpen?.(false);

      try {
        let fetchedDomains: TDomainResource[] | undefined;
        if (!selection?.domainColumns || !selection?.contactColumns) {
          throw new Error('Invalid selection');
        }

        // Phase 1: Fetch all domains if needed
        if (exportAllServices) {
          setExportProgress({
            current: 0,
            total: 0,
            percentage: 0,
            phase: 'fetching',
          });

          fetchedDomains = await fetchAllDomains((currentCount, totalCount) => {
            const percentage = totalCount
              ? Math.round((currentCount / totalCount) * 100)
              : 0;
            setExportProgress({
              current: currentCount,
              total: totalCount || 0,
              percentage,
              phase: 'fetching',
            });
          });
        }

        const domainsToExport = selectDomainsToExport(
          exportAllServices,
          selectedServiceNames,
          domainResources,
          fetchedDomains,
        );

        if (domainsToExport.length === 0) {
          setExportProgress(null);
          addError(t('domain_export_error_no_domains'), true);
          return;
        }

        // Phase 2: Process domain details
        setExportProgress({
          current: 0,
          total: domainsToExport.length,
          percentage: 0,
          phase: 'processing',
        });

        const BATCH_SIZE = 20;
        const exportData = await processBatch(
          domainsToExport,
          BATCH_SIZE,
          (domain) => fetchDomainDetails(domain, selection),
          setExportProgress,
        );

        // Phase 3: Generate CSV
        setExportProgress({
          current: exportData.length,
          total: exportData.length,
          percentage: 100,
          phase: 'generating',
        });

        const result = generateAndDownloadCsv(exportData);

        setExportProgress(null);
        setExportDone(result);
      } catch (exportError) {
        setExportProgress(null);
        addError(
          t('domain_export_error', { error: (exportError as Error).message }),
          true,
        );
      }
    },
    [
      exportAllServices,
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
