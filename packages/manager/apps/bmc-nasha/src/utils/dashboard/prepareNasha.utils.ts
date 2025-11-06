/* eslint-disable @typescript-eslint/no-explicit-any */

import type { TFunction } from 'i18next';

import type {
  Nasha,
  NashaRaw,
  NashaUse,
  NashaUseItem,
  NashaUseRaw,
} from '@/types/Dashboard.type';

import { NASHA_USE_SIZE_NAME } from '@/pages/dashboard/Dashboard.constants';

/**
 * Prepares use data by adding translated names and units
 */
export function prepareUse(
  use: NashaUseRaw,
  t: TFunction,
): NashaUse {
  return Object.keys(use).reduce(
    (result, type) => {
      const item = use[type];
      // Use legacy translation keys for use types and units (common translations)
      const nameKey = `nasha_use_type_${type}`;
      const translatedName = t(nameKey, { defaultValue: type });
      const name = translatedName === nameKey ? type : translatedName;

      const unitKey = `nasha_use_unit_${item.unit}`;
      const translatedUnit = t(unitKey, { defaultValue: item.unit });

      return {
        ...result,
        [type]: {
          ...item,
          name,
          unit: translatedUnit,
        },
      };
    },
    {} as NashaUse,
  );
}

/**
 * Prepares nasha data by transforming use, adding localeDatacenter and diskSize
 */
export function prepareNasha(
  nashaRaw: NashaRaw,
  t: TFunction,
): Nasha {
  const { use, ...rest } = nashaRaw;
  const useSize = use[NASHA_USE_SIZE_NAME];

  const preparedUse = prepareUse(use, t);

  // Use legacy translation keys for datacenters (common translations)
  const datacenterKey = `nasha_datacenter_${nashaRaw.datacenter.toLowerCase()}`;
  const localeDatacenter = t(datacenterKey, { defaultValue: nashaRaw.datacenter });

  const unitKey = `nasha_use_unit_${useSize.unit}`;
  const translatedUnit = t(unitKey, { defaultValue: useSize.unit });
  const diskSize = `${useSize.value} ${translatedUnit}`;

  return {
    ...rest,
    use: preparedUse,
    localeDatacenter,
    diskSize,
  };
}

