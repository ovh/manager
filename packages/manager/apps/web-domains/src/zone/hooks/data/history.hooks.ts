import { useMutation, useQueries, useQuery } from '@tanstack/react-query';
import {
  downloadZoneFile,
  getZoneHistory,
  getZoneHistoryByDate,
  getZoneSoa,
  restoreZone,
  TZoneSoa,
  updateZoneSoa,
} from '@/zone/data/api/history.api';
import { TZoneHistoryWithDate } from '@/zone/types/history.types';

/**
 * Hook to get zone history dates
 */
export const useGetZoneHistory = (zoneName: string) => {
  const isEnabled = !!zoneName;
  const { data, isLoading, error } = useQuery({
    queryKey: ['zone', 'history', zoneName],
    queryFn: () => getZoneHistory(zoneName),
    retry: false,
    enabled: isEnabled,
  });

  return {
    historyDates: data,
    isLoadingHistory: isLoading,
    historyError: error,
  };
};

/**
 * Hook to get zone history with all details
 * Fetches dates first, then fetches details for each date
 */
export const useGetZoneHistoryWithDetails = (
  zoneName: string,
  limit: number = 30,
) => {
  const { historyDates, isLoadingHistory, historyError } = useGetZoneHistory(
    zoneName,
  );

  const historyDatesSorted = historyDates ? [...historyDates] : [];
  historyDatesSorted.sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime(),
  );
  const sortedDates = historyDatesSorted.slice(0, limit);

  // Fetch details for each date
  const historyQueries = useQueries({
    queries: sortedDates.map((date) => ({
      queryKey: ['zone', 'history', zoneName, date],
      queryFn: () => getZoneHistoryByDate(zoneName, date),
      enabled: !!zoneName && !!historyDates && historyDates.length > 0,
      retry: false,
    })),
  });

  const isLoadingDetails = historyQueries.some((query) => query.isLoading);
  const hasErrors = historyQueries.some((query) => query.error);

  const historyWithDetails: TZoneHistoryWithDate[] = historyQueries
    .map((query, index) => {
      if (!query.data) return null;
      return {
        ...query.data,
        date: sortedDates[index],
        id: sortedDates[index],
      };
    })
    .filter((item): item is TZoneHistoryWithDate => item !== null);

  return {
    history: historyWithDetails,
    isLoading: isLoadingHistory || isLoadingDetails,
    error: historyError ||
      (hasErrors ? new Error('Failed to load details') : null),
  };
};

/**
 * Hook to download zone file
 */
export const useDownloadZoneFile = () => {
  return useMutation({
    mutationFn: async ({
      url,
      zoneName,
    }: {
      url: string;
      zoneName: string;
    }) => {
      const content = await downloadZoneFile(url);
      const blob = new Blob([content], { type: 'text/plain' });
      const blobUrl = globalThis.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.download = `${zoneName}_dns_zone.txt`;
      anchor.href = blobUrl;
      anchor.click();
      globalThis.URL.revokeObjectURL(blobUrl);
      return content;
    },
  });
};

/**
 * Hook to restore zone from history
 */
export const useRestoreZone = () => {
  return useMutation({
    mutationFn: ({
      zoneName,
      creationDate,
    }: {
      zoneName: string;
      creationDate: string;
    }) => restoreZone(zoneName, creationDate),
  });
};

/**
 * Hook to get zone SOA (used for default TTL)
 */
export const useGetZoneSoa = (zoneName: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['zone', 'soa', zoneName],
    queryFn: () => getZoneSoa(zoneName),
    enabled: !!zoneName,
    retry: false,
  });

  return {
    zoneSoa: data,
    isLoadingZoneSoa: isLoading,
    zoneSoaError: error,
  };
};

/**
 * Hook to update zone SOA (used for default TTL modification)
 */
export const useUpdateZoneSoa = () => {
  return useMutation({
    mutationFn: ({
      zoneName,
      soa,
    }: {
      zoneName: string;
      soa: TZoneSoa;
    }) => updateZoneSoa(zoneName, soa),
  });
};
