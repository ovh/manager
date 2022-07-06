import { TaskTracker } from '@ovh-ux/manager-components';

import { NASHA_USE_SIZE_NAME } from './nasha.constants';

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

export const preparePlans = (catalog, $filter) =>
  catalog.plans
    .filter((plan) => {
      try {
        const disk = catalog.products.find(({ name }) => name === plan.product)
          .blobs.technical.storage.disks[0];
        Object.assign(plan, { disk });
        return Boolean(disk.technology) && Boolean(disk.capacity);
      } catch (error) {
        return false;
      }
    })
    .map(({ disk, ...plan }) => ({
      ...plan,
      diskType: disk.technology.toLowerCase(),
      capacity: {
        label: $filter('bytes')(disk.capacity * 1000 * 1000 * 1000),
        value: disk.capacity / 1000,
      },
      datacenters: plan.configurations.find(({ name }) => name === 'datacenter')
        ?.values,
      defaultPrice: plan.pricings.find(({ mode }) => mode === 'default'),
      price: plan.pricings.find(
        ({ capacities, mode }) =>
          capacities.includes('renew') && mode === 'default',
      ),
    }));

export const prepareSnapshots = (
  snapshots,
  customSnapshots,
  SnapshotEnum,
  $translate,
) => ({
  types: SnapshotEnum.map((type) => ({
    type,
    label: $translate.instant(`nasha_snapshot_type_${type}`),
    enabled: snapshots.includes(type),
  })),
  customs: customSnapshots,
});

export const prepareTasks = (tasks, $translate) =>
  tasks.map((task) => ({
    ...task,
    localeOperation: localizeOperation(task.operation, $translate),
  }));

export const injectTaskTrackerState = ($stateProvider, stateName) => {
  const taskStateName = `${stateName}.task`;
  const componentName = `${stateName.replace(/\.\w/g, (x) =>
    x.slice(1).toUpperCase(),
  )}TaskTracker`;

  return $stateProvider.state(
    taskStateName,
    TaskTracker.createStateOptions(componentName, {
      params: ['partitionName', 'customSnapshotName'],
      header: `
        <div class="mb-4">
          <oui-message data-type="warning" class="d-block mb-4">
              <span data-translate="nasha_task_tracker_warning"></span>
          </oui-message>
          <strong
              class="d-block"
              data-ng-if="$ctrl.partitionName"
              data-translate="nasha_task_tracker_header_partitionName"
              data-translate-values="$ctrl"
          ></strong>
          <strong
              class="d-block"
              data-ng-if="$ctrl.customSnapshotName"
              data-translate="nasha_task_tracker_header_customSnapshotName"
              data-translate-values="$ctrl"
          ></strong>
        </div>
      `,
      resolve: {
        endpoint: /* @ngInject */ (serviceName) =>
          `/dedicated/nasha/${serviceName}/task`,
        heading: /* @ngInject */ ($translate, tasks) =>
          $translate.instant(`nasha_operation_${tasks[0].operation}`),
        onDone: /* @ngInject */ ($translate, goBack, $transition$) => (
          $tasks,
        ) =>
          goBack({
            stateName,
            reload: true,
            ...($tasks.every((task) => task.status === 'done') && {
              success: $translate.instant(
                `nasha_operation_${$tasks[0].operation}_success`,
                $transition$.params(),
              ),
            }),
          }),
      },
    }),
  );
};

export default {
  injectTaskTrackerState,
  localizeDatacenter,
  localizeOperation,
  prepareNasha,
  preparePartition,
  preparePlans,
  prepareSnapshots,
  prepareTasks,
};
