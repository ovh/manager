import { VCDCompute } from '@ovh-ux/manager-module-vcd-api';

export type IsComputeDeletableParams = {
  computeList: VCDCompute[];
  compute?: VCDCompute;
};
type IsComputeDeletableResult = {
  isDeletable: boolean;
  tooltipTranslationKey: string;
};

const COMPUTE_MIN_QUANTITY = 1;
export const FREE_COMPUTE_PLANCODE = 'Pack 1664 Standard  - Initial Pack';

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

  const freeCompute = computeList.find(
    (host) => host.currentState.profile === FREE_COMPUTE_PLANCODE,
  );
  if (freeCompute && compute.id !== freeCompute.id) {
    return {
      ...result,
      tooltipTranslationKey:
        'managed_vcd_vdc_compute_delete_tooltip_free_compute',
    };
  }

  return { ...result, isDeletable: true, tooltipTranslationKey: '' };
};
