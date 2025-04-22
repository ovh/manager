import { ColumnSort, PaginationState } from '@ovh-ux/manager-react-components';
import { TVolume } from '@/api/hooks/useVolume';
import { TAPIVolume } from '@/api/data/volume';

export const sortResults = (items: TVolume[], sorting: ColumnSort) => {
  let data = [...items];
  switch (sorting?.id) {
    case 'status':
      data = [...items].sort((a, b) => (a.statusGroup > b.statusGroup ? 1 : 0));
      break;
    case 'attachedTo':
      data = [...items].sort((a, b) => {
        const aAttachedTo = a.attachedTo[0] || '';
        const bAttachedTo = b.attachedTo[0] || '';
        return aAttachedTo > bAttachedTo ? 1 : 0;
      });
      break;
    default:
      data = [...items].sort((a, b) =>
        a[sorting?.id] > b[sorting?.id] ? 1 : 0,
      );
      break;
  }

  if (sorting) {
    const { desc } = sorting;

    if (desc) {
      data.reverse();
    }
  }
  return data;
};

export const paginateResults = <T>(
  items: T[],
  pagination: PaginationState,
) => ({
  rows: items.slice(
    pagination.pageIndex * pagination.pageSize,
    (pagination.pageIndex + 1) * pagination.pageSize,
  ),
  pageCount: Math.ceil(items.length / pagination.pageSize),
  totalRows: items.length,
});

export const mapVolumeStatus = <V extends TAPIVolume>(
  volume: V,
): V & { statusGroup: string } => {
  let statusGroup = '';
  if (['available', 'in-use'].includes(volume.status)) {
    statusGroup = 'ACTIVE';
  }
  if (
    [
      'creating',
      'attaching',
      'detaching',
      'deleting',
      'backing-up',
      'restoring-backup',
      'snapshotting',
      'awaiting-transfer',
    ].includes(volume.status)
  ) {
    statusGroup = 'PENDING';
  }
  if (
    ['error', 'error_deleting', 'error_restoring', 'error_extending'].includes(
      volume.status,
    )
  ) {
    statusGroup = 'ERROR';
  }

  return {
    ...volume,
    statusGroup,
  };
};
