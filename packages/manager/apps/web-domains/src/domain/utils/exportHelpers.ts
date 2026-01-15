import { download, generateCsv, mkConfig } from 'export-to-csv';
import { TDomainResource } from '@/domain/types/domainResource';
import {
  ExportProgress,
  ExportResult,
  ExportRowData,
} from '@/domain/types/export.types';

// Selects domains to export based on the export mode
export const selectDomainsToExport = (
  exportAllServices: boolean,
  selectedServiceNames: string[],
  domainResources: TDomainResource[] | null,
  fetchedDomains?: TDomainResource[],
): TDomainResource[] => {
  if (exportAllServices && fetchedDomains && fetchedDomains.length > 0) {
    return fetchedDomains;
  }

  if (exportAllServices && domainResources) {
    return domainResources;
  }

  if (!exportAllServices && domainResources) {
    return domainResources.filter((domain) =>
      selectedServiceNames.includes(domain.id),
    );
  }

  return [];
};

// Processes items in batches with progress tracking
export const processBatch = async <ExportRowData>(
  items: TDomainResource[],
  batchSize: number,
  processor: (item: TDomainResource) => Promise<ExportRowData>,
  onProgress?: (progress: ExportProgress) => void,
): Promise<ExportRowData[]> => {
  const totalItems = items.length;
  const results: ExportRowData[] = [];
  let processedCount = 0;

  const batches: TDomainResource[][] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    batches.push(items.slice(i, i + batchSize));
  }

  await batches.reduce(async (previousPromise, batch) => {
    await previousPromise;

    const batchResults = await Promise.all(batch.map(processor));

    results.push(...batchResults);
    processedCount += batch.length;

    const percentage = Math.round((processedCount / totalItems) * 100);
    onProgress?.({
      current: processedCount,
      total: totalItems,
      percentage,
      phase: 'processing',
    });
  }, Promise.resolve());

  return results;
};

// Generates and downloads a CSV file from data
export const generateAndDownloadCsv = (data: ExportRowData[]): ExportResult => {
  const csvConfig = mkConfig({
    filename: `domains_export_${new Date().toISOString().split('T')[0]}`,
    fieldSeparator: ',',
    quoteStrings: true,
    useKeysAsHeaders: true,
  });

  const csv = generateCsv(csvConfig)(data);
  download(csvConfig)(csv);

  const csvString = typeof csv === 'string' ? csv : csv.toString();
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const downloadUrl = URL.createObjectURL(blob);
  const filename = `${csvConfig.filename}.csv`;

  return {
    downloadUrl,
    filename,
    total: data.length,
  };
};
