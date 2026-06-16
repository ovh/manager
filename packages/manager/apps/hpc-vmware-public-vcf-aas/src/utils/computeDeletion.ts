import { VCDCompute } from '@ovh-ux/manager-module-vcd-api';
import {
  COMPUTE_MIN_QUANTITY,
  FREESPARE_REGEX,
} from './computeDeletion.constants';

export type IsComputeDeletableParams = {
  computeList: VCDCompute[];
  compute?: VCDCompute;
};
type IsComputeDeletableResult = {
  isDeletable: boolean;
  tooltipTranslationKey: string;
};

export const isFreespareCompute = (compute: VCDCompute) => {
  return FREESPARE_REGEX.test(compute.currentState.profile);
};

export const isComputeDeletable = ({
  computeList,
  compute,
}: IsComputeDeletableParams): IsComputeDeletableResult => {
  const result: IsComputeDeletableResult = {
    isDeletable: false,
    tooltipTranslationKey: 'managed_vcd_vdc_contact_support',
  };

  if (!computeList || !compute) return result;
  if (computeList.length <= COMPUTE_MIN_QUANTITY) {
    return {
      ...result,
      tooltipTranslationKey:
        'managed_vcd_vdc_compute_delete_tooltip_min_quantity',
    };
  }

  const freeCompute = computeList.find(isFreespareCompute);

  if (freeCompute && compute.id !== freeCompute.id) {
    return {
      ...result,
      tooltipTranslationKey:
        'managed_vcd_vdc_compute_delete_tooltip_free_compute',
    };
  }

  return { ...result, isDeletable: true, tooltipTranslationKey: '' };
};
