import { apiClient } from '@ovh-ux/manager-core-api';
import { Guide } from '@/types/guide';

interface GetGuidesProps {
  section?: string;
  lang?: string;
  engines?: string[];
}
export const getGuides = async ({ section, lang, engines }: GetGuidesProps) => {
  const headers: Record<string, string> = {
    'X-Pagination-Mode': 'CachedObjectList-Pages',
    'X-Pagination-Size': '50000',
  };
  const filters = [];
  if (section) {
    filters.push(`section:eq=${section}`);
  }
  if (lang) {
    filters.push(`lang:eq=${lang}`);
  }
  if (engines && engines.length > 0) {
    filters.push(
      engines.length === 1
        ? `engine:eq=${engines[0]}`
        : `engine:in=${engines.join(',')}`,
    );
  }
  if (filters.length > 0) {
    headers['X-Pagination-Filter'] = filters.join('&');
  }
  return apiClient.v2
    .get(`/guides/cloud/databases`, {
      headers,
    })
    .then((res) => res.data as Guide[]);
};
