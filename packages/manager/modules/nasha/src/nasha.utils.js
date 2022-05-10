import { NASHA_USE_SIZE_NAME, NASHA_TASK } from './nasha.constants';

export const localizeDatacenter = (datacenter, $translate) =>
  $translate.instant(`nasha_datacenter_${datacenter.toLowerCase()}`);

export const localizeOperation = (operation, $translate) =>
  $translate.instant(`nasha_operation_${operation}`);

/*
 * use = {
 *   usedbysnapshots: {
 *     unit: 'GB',
 *     value: 0.02,
 *     name: 'Snapshots', // obtained by translating the usedbysnapshots type
 *   },
 *   ...
 * }
 */
const prepareUse = (use, $translate) =>
  Object.keys(use).reduce(
    (result, type) => ({
      ...result,
      [type]: {
        ...use[type],
        name: (() => {
          const key = `nasha_use_type_${type}`;
          const name = $translate.instant(key);
          return name === key ? type : name;
        })(),
        unit: $translate.instant(`nasha_use_unit_${use[type].unit}`),
      },
    }),
    {},
  );

export const prepareNasha = ({ use, ...nasha }, $translate) => {
  const useSize = use[NASHA_USE_SIZE_NAME];
  return {
    ...nasha,
    use: prepareUse(use, $translate),
    localeDatacenter: localizeDatacenter(nasha.datacenter, $translate),
    diskSize: `${useSize.value} ${$translate.instant(
      `nasha_use_unit_${useSize.unit}`,
    )}`,
  };
};

export const preparePartition = ({ use, ...partition }, $translate) => ({
  ...partition,
  use: use ? prepareUse(use, $translate) : null,
  protocol: partition.protocol?.split('_').join(' '),
});

export const preparePartitionSnapshots = (
  partition,
  snapshots,
  customSnapshots,
  SnapshotEnum,
  tasks,
  $translate,
) => {
  const partitionTasks = tasks.filter(
    ({ partitionName }) => partitionName === partition.partitionName,
  );

  const snapshotsMap = {
    types: SnapshotEnum.map((type) => ({
      type,
      label: $translate.instant(`nasha_snapshot_type_${type}`),
      enabled: snapshots.includes(type),
      tasks: {
        update: partitionTasks.filter(
          ({ details, operation }) =>
            details === type &&
            operation === NASHA_TASK.operation.SnapshotUpdate,
        ),
      },
    })),
    customs: customSnapshots.map((name) => ({
      name,
      tasks: {
        delete: partitionTasks.filter(
          ({ details, operation }) =>
            details === name &&
            operation === NASHA_TASK.operation.CustomSnapshotDelete,
        ),
      },
    })),
  };

  partitionTasks
    .filter(
      ({ operation }) =>
        operation === NASHA_TASK.operation.CustomSnapshotCreate,
    )
    .forEach((customSnapshotCreateTask) => {
      const { details: name } = customSnapshotCreateTask;
      if (!snapshotsMap.customs.find((custom) => custom.name === name)) {
        snapshotsMap.customs.push({
          name,
          tasks: { create: [customSnapshotCreateTask] },
        });
      }
    });

  return snapshotsMap;
};

export const prepareTasks = (tasks, $translate) =>
  tasks.map((task) => ({
    ...task,
    localeOperation: localizeOperation(task.operation, $translate),
  }));

export default {
  localizeDatacenter,
  localizeOperation,
  prepareNasha,
  preparePartition,
  preparePartitionSnapshots,
  prepareTasks,
};
