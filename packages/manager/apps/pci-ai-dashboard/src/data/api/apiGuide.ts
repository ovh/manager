import { apiClient } from '@ovh-ux/manager-core-api';
import { Guide } from '@/types/guide';
import { PCIAi } from '.';

export interface GetGuidesProps extends PCIAi {
  section?: string;
  lang?: string;
}
export const getGuides = async ({
  projectId,
  section,
  lang,
}: GetGuidesProps) => {
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
  if (filters.length > 0) {
    headers['X-Pagination-Filter'] = filters.join('&');
  }
  return apiClient.v6
    .get(`/cloud/project/${projectId}/ai/guides`, {
      headers,
    })
    .then((res) => res.data as Guide[]);
};
