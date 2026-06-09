import { v6 } from '@ovh-ux/manager-core-api';

export type TShareResource = {
  id: string;
  name: string;
  region: string;
  type: string;
};

// Page size proven to work on /aggregated/share (the pci-file-storage app
// paginates with limit 20); higher values (e.g. 100) are rejected.
const SHARES_PAGE_SIZE = 20;
// Safety bound to keep the recursion finite (500 pages * 20 = 10k shares).
const SHARES_MAX_PAGES = 500;

// /aggregated/share requires classic pagination (limit > 0) and does NOT
// support the CachedObjectList mode. Page through with offset until a partial
// page is returned to retrieve every share of the project.
const fetchSharesPage = async (
  projectId: string,
  offset: number,
  page: number,
): Promise<TShareResource[]> => {
  const { data } = await v6.get<TShareResource[]>(
    `/cloud/project/${projectId}/aggregated/share`,
    {
      params: {
        limit: SHARES_PAGE_SIZE,
        offset,
        sort: 'name',
        sortOrder: 'asc',
      },
    },
  );

  if (data.length < SHARES_PAGE_SIZE || page + 1 >= SHARES_MAX_PAGES) {
    return data;
  }

  const nextPages = await fetchSharesPage(
    projectId,
    offset + SHARES_PAGE_SIZE,
    page + 1,
  );
  return [...data, ...nextPages];
};

export const getShares = (projectId: string): Promise<TShareResource[]> =>
  fetchSharesPage(projectId, 0, 0);
