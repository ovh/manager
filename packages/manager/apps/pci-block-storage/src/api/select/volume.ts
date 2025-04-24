import { ColumnSort, PaginationState } from '@ovh-ux/manager-react-components';
import { TVolume } from '@/api/hooks/useVolume';
import { TAPIVolume } from '@/api/data/volume';
import { TVolumeCatalog } from '@/api/data/catalog';

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

export type WithAttach<V extends TAPIVolume> = V & {
  canAttachInstance: boolean;
  canDetachInstance: boolean;
  maxAttachableInstances: number;
};

export const mapVolumeAttach = (catalog?: TVolumeCatalog) => {
  const catalogPricing = new Map(
    catalog?.models.map((m) => [
      m.name,
      new Map(m.pricings.flatMap((p) => p.regions.map((r) => [r, p]))),
    ]),
  );

  if (!catalogPricing)
    return <V extends TAPIVolume>(volume: V): WithAttach<V> => ({
      ...volume,
      canAttachInstance: false,
      canDetachInstance: false,
      maxAttachableInstances: 1,
    });

  return <V extends TAPIVolume>(volume: V): WithAttach<V> => {
    const pricing = catalogPricing.get(volume.type)?.get(volume.region);

    // TODO : update this block when api is up to date
    let maxAttachableInstances = 1;
    if (pricing && pricing.specs.maxAttachableInstances) {
      maxAttachableInstances = pricing.specs.maxAttachableInstances;
    } else if (volume.type === 'classic' && volume.region === 'EU-WEST-PAR') {
      maxAttachableInstances = 16;
    }

    return {
      ...volume,
      maxAttachableInstances,
      canAttachInstance: maxAttachableInstances > volume.attachedTo.length,
      canDetachInstance: volume.attachedTo.length > 0,
    };
  };
};
