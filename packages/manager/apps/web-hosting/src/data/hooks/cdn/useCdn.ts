import { useQuery } from '@tanstack/react-query';

//@TO DO comments for nexts dev
import {
  // getCDNDomainOptionDetails,
  //getCDNDomainsOptions,
  getCDNProperties,
  // getSharedCDNDomainDetails,
  // getSharedCDNDomains,
} from '@/data/api/cdn';

const baseCdnQueryKey = (serviceName: string) => ['hosting', 'web', serviceName, 'cdn'];

export const useGetCDNProperties = (serviceName: string) =>
  useQuery({
    queryKey: [baseCdnQueryKey(serviceName)],
    queryFn: () => getCDNProperties(serviceName),
    enabled: Boolean(serviceName),
  });

/* export const useGetSharedCDNAvailableOptions = (serviceName: string) =>
  useQuery({
    queryKey: [baseCdnQueryKey(serviceName), 'availableOptions'],
    queryFn: () => getCDNProperties(serviceName),
    enabled: Boolean(serviceName),
  });

export const useGetSharedCDNDomains = (serviceName: string) =>
  useQuery({
    queryKey: [baseCdnQueryKey(serviceName), 'domain'],
    queryFn: () => getSharedCDNDomains(serviceName),
    enabled: Boolean(serviceName),
  });

export const useGetSharedCDNDomainDetails = (serviceName: string, domain: string) =>
  useQuery({
    queryKey: [baseCdnQueryKey(serviceName), 'domain', domain],
    queryFn: () => getSharedCDNDomainDetails(serviceName, domain),
    enabled: Boolean(serviceName),
  });

export const useGetCDNDomainsOptions = (serviceName: string, domain: string) =>
  useQuery({
    queryKey: [baseCdnQueryKey(serviceName), 'domain', domain, 'option'],
    queryFn: () => getCDNDomainsOptions(serviceName, domain),
    enabled: Boolean(serviceName),
  });

export const useGetCDNDomainOptionDetails = (serviceName: string, domain: string, option: string) =>
  useQuery({
    queryKey: [baseCdnQueryKey(serviceName), 'domain', domain, 'option', option],
    queryFn: () => getCDNDomainOptionDetails(serviceName, domain, option),
    enabled: Boolean(serviceName),
  });
 */
