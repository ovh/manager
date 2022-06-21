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

export default {
  localizeDatacenter,
  localizeOperation,
  prepareNasha,
  preparePartition,
  preparePlans,
};
