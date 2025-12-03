import { ColumnSort } from '@tanstack/react-table';
import { pick } from 'lodash';

import { TProductAvailability, TRegion } from '@ovh-ux/manager-pci-common';

import { isSnapshotConsumption } from '@/pages/new/utils/is-snapshot-consumption';
import { TEFlavor } from '@/types/flavor/entity';
import { TEInstance } from '@/types/instance/entity';

const mapInstanceFlavor = (flavors: TEFlavor[] | null) => {
  const flavorsMap = new Map(flavors?.map((f) => [f.id, f]));

  return (instance: TEInstance): TInstance['flavor'] => {
    const flavor = flavorsMap.get(instance.flavorId);

    return (flavor ? flavor.name : instance.flavorId) as TInstance['flavor'];
  };
};

type TInstanceStatus = Readonly<{
  group: Opaque<string, TInstanceStatus>;
  name: Opaque<string, TInstanceStatus>;
}>;
// eslint-disable-next-line complexity
const mapInstanceStatus = ({ status }: TEInstance): TInstanceStatus => {
  let group: string;
  switch (status) {
    case 'BUILDING':
    case 'REBOOT':
    case 'REBUILD':
    case 'REVERT_RESIZE':
    case 'SOFT_DELETED':
    case 'VERIFY_RESIZE':
    case 'MIGRATING':
    case 'RESIZE':
    case 'BUILD':
    case 'SHUTOFF':
    case 'RESCUE':
    case 'SHELVED':
    case 'SHELVED_OFFLOADED':
    case 'RESCUING':
    case 'UNRESCUING':
    case 'SNAPSHOTTING':
    case 'RESUMING':
    case 'HARD_REBOOT':
    case 'PASSWORD':
    case 'PAUSED':
      group = 'PENDING';
      break;
    case 'DELETED':
    case 'ERROR':
    case 'STOPPED':
    case 'SUSPENDED':
    case 'UNKNOWN':
      group = 'ERROR';
      break;
    case 'ACTIVE':
    case 'RESCUED':
    case 'RESIZED':
      group = 'ACTIVE';
      break;
    default:
      group = status.toUpperCase();
  }

  return {
    group: group as TInstanceStatus['group'],
    name: status as TInstanceStatus['name'],
  };
};

type TMicroRegionTranslator = (region: string) => string;
type TInstanceRegion = Readonly<{
  label: Opaque<string, TInstanceRegion>;
  id: Opaque<string, TInstanceRegion>;
}>;

const mapInstanceRegion =
  (translateMicroRegion: TMicroRegionTranslator) =>
  (instance: TEInstance): TInstanceRegion => ({
    label: translateMicroRegion(instance.region) as TInstanceRegion['label'],
    id: instance.region as TInstanceRegion['id'],
  });

type TInstanceAutoBackup = boolean;
const mapAutoBackup = (
  snapshotAvailability: TProductAvailability | null,
  regions: TRegion[] | null,
) => {
  const regionsWithSnapshotAvailability = new Set(
    snapshotAvailability?.plans
      .filter(({ code }) => isSnapshotConsumption(code))
      .flatMap(({ regions }) => regions.map((r) => r.name)),
  );

  const regionsWithWorkflow = new Set(
    regions
      ?.filter((region) => region.services.find((service) => service.name === 'workflow'))
      .map((region) => region.name),
  );

  return (instance: TEInstance): TInstanceAutoBackup => {
    return (
      regionsWithSnapshotAvailability.has(instance.region) &&
      regionsWithWorkflow.has(instance.region)
    );
  };
};

export type TInstance = Readonly<{
  id: Opaque<{ id: string; region: string }, TInstance>;
  name: Opaque<string, TInstance>;
  label: Opaque<string, TInstance>;
  flavor: Opaque<string, TInstance>;
  status: TInstanceStatus;
  region: TInstanceRegion;
  autoBackup: TInstanceAutoBackup;
  searchField: string;
}>;

export const buildInstanceId = (id: string, region: string) => ({ id, region }) as TInstance['id'];

export const isSameInstanceId = (a: TInstance['id'], b: TInstance['id']): boolean =>
  a.id === b.id && a.region === b.region;

export const mapInstance = (
  instances: TEInstance[],
  flavors: TEFlavor[] | null,
  translateMicroRegion: TMicroRegionTranslator,
  snapshotAvailability: TProductAvailability | null,
  regions: TRegion[] | null,
  // eslint-disable-next-line max-params
) => {
  const regionMapper = mapInstanceRegion(translateMicroRegion);
  const autoBackupMapper = mapAutoBackup(snapshotAvailability, regions);

  return instances.map<TInstance>((instance) => {
    const flavor = mapInstanceFlavor(flavors)(instance);
    const status = mapInstanceStatus(instance);
    const region = regionMapper(instance);

    return {
      ...(pick(instance, ['name']) as Pick<TInstance, 'name'>),
      id: buildInstanceId(instance.id, instance.region),
      label: instance.id as TInstance['label'],
      flavor,
      status,
      region,
      autoBackup: autoBackupMapper(instance),
      searchField: `${instance.name} ${region.label} ${status.name} ${flavor}`,
    };
  });
};

export const sortResults = (items: TInstance[], sorting: ColumnSort | undefined) => {
  if (!sorting) return items;

  const fieldMapper: (instance: TInstance) => TInstance[keyof TInstance] | string = (
    instance: TInstance,
  ) => {
    switch (sorting.id) {
      case 'status':
        return instance.status.group;
      case 'region':
        return instance.region.id;
      default:
        return instance[sorting.id as keyof TInstance];
    }
  };

  const compare = (instA: TInstance, instB: TInstance) => {
    const valA = fieldMapper(instA);
    const valB = fieldMapper(instB);

    if (valA === valB) return 0;
    return valA > valB ? 1 : -1;
  };

  let data = [...items].sort(compare);

  if (sorting.desc) {
    data.reverse();
  }

  return data;
};
