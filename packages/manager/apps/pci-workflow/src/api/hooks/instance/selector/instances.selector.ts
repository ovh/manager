import { ColumnSort } from '@tanstack/react-table';
import { pick } from 'lodash';

import { TProductAvailability, TRegion } from '@ovh-ux/manager-pci-common';

import { isSnapshotConsumption } from '@/pages/new/utils/is-snapshot-consumption';
import { TEFlavor } from '@/types/flavor/entity';
import { TEInstance } from '@/types/instance/entity';

type TInstanceFlavor = Readonly<{
  label: Opaque<string, TInstanceFlavor>;
}>;

const mapInstanceFlavor = (flavors: TEFlavor[] | null) => {
  const flavorsMap = new Map(flavors?.map((f) => [f.id, f]));

  return (instance: TEInstance): TInstanceFlavor => {
    const flavor = flavorsMap.get(instance.flavorId);

    return {
      label: (flavor ? flavor.name : instance.flavorId) as TInstanceFlavor['label'],
    };
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
}>;

const mapInstanceRegion =
  (translateMicroRegion: TMicroRegionTranslator) =>
  (instance: TEInstance): TInstanceRegion => ({
    label: translateMicroRegion(instance.region) as TInstanceRegion['label'],
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
  flavor: TInstanceFlavor;
  status: TInstanceStatus;
  region: TInstanceRegion;

  autoBackup: TInstanceAutoBackup;
}>;

export const buildInstanceId = (id: string, region: string) => ({ id, region }) as TInstance['id'];

export const isSameInstanceId = (a: TInstance['id'], b: TInstance['id']): boolean =>
  a.id === b.id && a.region === b.region;

export const instancesSelector = (
  instances: TEInstance[],
  flavors: TEFlavor[] | null,
  translateMicroRegion: TMicroRegionTranslator,
  snapshotAvailability: TProductAvailability | null,
  regions: TRegion[] | null,
  // eslint-disable-next-line max-params
) => {
  const regionMapper = mapInstanceRegion(translateMicroRegion);
  const autoBackupMapper = mapAutoBackup(snapshotAvailability, regions);

  return instances.map<TInstance>((instance) => ({
    ...(pick(instance, ['name']) as Pick<TInstance, 'name'>),
    id: buildInstanceId(instance.id, instance.region),
    label: instance.id as TInstance['label'],
    flavor: mapInstanceFlavor(flavors)(instance),
    status: mapInstanceStatus(instance),
    region: regionMapper(instance),
    autoBackup: autoBackupMapper(instance),
  }));
};

export const sortResults = (items: TInstance[], sorting: ColumnSort | undefined) => {
  if (!sorting) return items;

  const fieldMapper: (instance: TInstance) => TInstance[keyof TInstance] | string =
    sorting.id === 'status' ? (i) => i.status.group : (i) => i[sorting.id as keyof TInstance];

  let data = [...items].sort((a, b) => (fieldMapper(a) > fieldMapper(b) ? 1 : 0));

  if (sorting.desc) {
    data.reverse();
  }

  return data;
};
