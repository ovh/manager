import { useMutation, useQueries, useQuery } from '@tanstack/react-query';
import {
  downloadZoneFile,
  getEmailDomain,
  getEmailRecommendedDNSRecords,
  getHostingDetails,
  getHostings,
  getZoneHistory,
  getZoneHistoryByDate,
  getZoneSoa,
  resetZone,
  restoreZone,
  TZoneSoa,
  updateZoneSoa,
  DnsRecord,
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
 * Hook to fetch zone file content for viewing
 */
export const useViewZoneFile = () => {
  return useMutation({
    mutationFn: (url: string) => downloadZoneFile(url),
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

/**
 * Hook to reset a DNS zone
 */
export const useResetZone = () => {
  return useMutation({
    mutationFn: ({
      zoneName,
      minimized,
      dnsRecords,
    }: {
      zoneName: string;
      minimized: boolean;
      dnsRecords: DnsRecord[] | null;
    }) => resetZone(zoneName, minimized, dnsRecords),
  });
};

/**
 * Hook to get the list of web hostings
 */
export const useGetHostings = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['hosting', 'web'],
    queryFn: getHostings,
  });
  return { hostings: data ?? [], isLoadingHostings: isLoading };
};

/**
 * Hook to get details of a specific web hosting (to retrieve hostingIp)
 */
export const useGetHostingDetails = (hosting: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ['hosting', 'web', hosting],
    queryFn: () => getHostingDetails(hosting),
    enabled: !!hosting,
  });
  return { hostingDetails: data, isLoadingHostingDetails: isLoading };
};

/**
 * Hook to check if an email domain exists and its offer type
 */
export const useGetEmailDomain = (domain: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['email', 'domain', domain],
    queryFn: () => getEmailDomain(domain),
    enabled: !!domain,
    retry: false,
  });
  return { emailDomain: data, isLoadingEmailDomain: isLoading, emailDomainError: error };
};

/**
 * Hook to get recommended DNS records for an email domain
 */
export const useGetEmailRecommendedDNS = (domain: string, enabled: boolean) => {
  const { data, isLoading } = useQuery({
    queryKey: ['email', 'domain', domain, 'recommendedDNS'],
    queryFn: () => getEmailRecommendedDNSRecords(domain),
    enabled: !!domain && enabled,
    retry: false,
  });
  return { emailRecommendedDNS: data ?? [], isLoadingEmailDNS: isLoading };
};

/**
 * Hook to compare two zone files by downloading them in parallel
 */
export const useCompareZoneFiles = () => {
  return useMutation({
    mutationFn: async ({
      baseUrl,
      modifiedUrl,
    }: {
      baseUrl: string;
      modifiedUrl: string;
    }) => {
      const [baseContent, modifiedContent] = await Promise.all([
        downloadZoneFile(baseUrl),
        downloadZoneFile(modifiedUrl),
      ]);
      return { baseContent, modifiedContent };
    },
  });
};
