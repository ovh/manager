import { NASHA_USE_SIZE_NAME } from './nasha.constants';

export const localizeDatacenter = (datacenter, $translate) =>
  $translate.instant(`nasha_datacenter_${datacenter.toLowerCase()}`);

export const prepareNasha = ({ use, ...nasha }, $translate) => {
  const useSize = use[NASHA_USE_SIZE_NAME];
  return {
    ...nasha,
    /*
     * nasha = {
     *   use: {
     *     usedbysnapshots: {
     *       unit: 'GB',
     *       value: 0.02,
     *
     *       // Augmented data
     *       name: 'Snapshots',
     *     },
     *   }
     * }
     */
    use: Object.keys(use).reduce(
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
    ),
    localeDatacenter: localizeDatacenter(nasha.datacenter, $translate),
    diskType: 'N/A',
    diskSize: `${useSize.value} ${$translate.instant(
      `nasha_use_unit_${useSize.unit}`,
    )}`,
  };
};

export default {
  localizeDatacenter,
  prepareNasha,
};
