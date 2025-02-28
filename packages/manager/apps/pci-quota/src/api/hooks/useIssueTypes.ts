import { useQuery } from '@tanstack/react-query';
import { getIssueTypes } from '@/api/data/issue';

export const useGetIssueTypes = (language: string) =>
  useQuery({
    queryKey: ['issueTypes', language],
    queryFn: () => getIssueTypes(language),
  });
