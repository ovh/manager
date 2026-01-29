import type { TVps, TVpsList } from '../entities/vps';

export type TSortDirection = 'asc' | 'desc';
export type TSortableField = 'displayName' | 'state' | 'datacenter' | 'expirationDate';

export const filterVpsByName =
  (searchTerm: string) =>
  (vpsList: TVpsList): TVpsList => {
    if (!searchTerm.trim()) return vpsList;

    const lowerSearch = searchTerm.toLowerCase().trim();

    return vpsList.filter(
      (vps) =>
        vps.displayName.toLowerCase().includes(lowerSearch) ||
        vps.serviceName.toLowerCase().includes(lowerSearch),
    );
  };

export const sortVpsBy =
  (field: TSortableField, direction: TSortDirection = 'asc') =>
  (vpsList: TVpsList): TVpsList => {
    const multiplier = direction === 'asc' ? 1 : -1;

    return [...vpsList].sort((a, b) => {
      switch (field) {
        case 'displayName':
          return multiplier * a.displayName.localeCompare(b.displayName);

        case 'state':
          return multiplier * a.state.localeCompare(b.state);

        case 'datacenter':
          return multiplier * a.location.datacenter.localeCompare(b.location.datacenter);

        case 'expirationDate': {
          const dateA = a.subscription.expirationDate ?? '';
          const dateB = b.subscription.expirationDate ?? '';
          return multiplier * dateA.localeCompare(dateB);
        }

        default:
          return 0;
      }
    });
  };

export const paginateVps =
  (page: number, pageSize: number) =>
  (vpsList: TVpsList): TVpsList => {
    const startIndex = (page - 1) * pageSize;
    return vpsList.slice(startIndex, startIndex + pageSize);
  };

export const getVpsCount = (vpsList: TVpsList): number => vpsList.length;

export const normalizeVpsList = (
  vpsList: TVpsList,
): { byId: Map<string, TVps>; allIds: Array<string> } => {
  const byId = new Map<string, TVps>();
  const allIds: Array<string> = [];

  vpsList.forEach((vps) => {
    byId.set(vps.serviceName, vps);
    allIds.push(vps.serviceName);
  });

  return { byId, allIds };
};
