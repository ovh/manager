import { ColumnSort, PaginationState } from '@ovh-ux/manager-react-components';
import { TVolume } from '@/api/hooks/useVolume';
import { TAPIVolume } from '@/api/data/volume';
import { TVolumeCatalog } from '@/api/data/catalog';

export const sortResults = (items: TVolume[], sorting: ColumnSort) => {
  let sortFn: (a: TVolume, b: TVolume) => number;

  switch (sorting?.id) {
    case 'status':
      sortFn = (a, b) => (a.statusGroup > b.statusGroup ? 1 : 0);
      break;
    case 'attachedTo':
      sortFn = (a, b) => {
        const aAttachedTo = a.attachedTo[0] || '';
        const bAttachedTo = b.attachedTo[0] || '';
        return aAttachedTo > bAttachedTo ? 1 : 0;
      };
      break;
    default:
      sortFn = (a, b) => (a[sorting.id] > b[sorting.id] ? 1 : 0);
      break;
  }

  return [...items].sort(sorting?.desc ? (a, b) => -sortFn(a, b) : sortFn);
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

export type WithAttach<V extends TAPIVolume> = V & {
  canAttachInstance: boolean;
  canDetachInstance: boolean;
  maxAttachedInstances: number;
};

export const mapVolumeAttach = (catalog?: TVolumeCatalog) => {
  const catalogPricing = new Map(
    catalog?.models.map((m) => [
      m.name,
      new Map(m.pricings.flatMap((p) => p.regions.map((r) => [r, p]))),
    ]),
  );

  return <V extends TAPIVolume>(volume: V): WithAttach<V> => {
    const pricing = catalogPricing.get(volume.type)?.get(volume.region);

    const maxAttachedInstances = pricing?.specs.maxAttachedInstances || 1;

    return {
      ...volume,
      maxAttachedInstances,
      canAttachInstance: maxAttachedInstances > volume.attachedTo.length,
      canDetachInstance: volume.attachedTo.length > 0,
    };
  };
};
