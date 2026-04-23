import { useQuery } from '@tanstack/react-query';
import { Country } from '@ovh-ux/manager-config';
import {
  getCompanySuggestion,
  GetCompanySuggestionError,
} from '@/data/api/suggestion';
import { CompanySuggestion } from '@/types/suggestion';

export const useCompanySuggestionQueryKey = (search?: string) => [
  'suggestion',
  'company',
  search,
];

export const useCompanySuggestion = (country?: Country, search?: string) =>
  useQuery<
    CompanySuggestion,
    GetCompanySuggestionError,
    { companies: CompanySuggestion['entryList']; hasMore?: boolean }
  >({
    queryKey: useCompanySuggestionQueryKey(search),
    queryFn: () => getCompanySuggestion(country!, search!),
    select: (data: CompanySuggestion) => ({
      companies: data.entryList,
      hasMore: data.hasMore,
    }),
    enabled: false,
    retry: (failureCount: number, error: GetCompanySuggestionError) =>
      Boolean(error.status && error.status >= 500) && failureCount <= 3,
    retryDelay: 5000,
  });
