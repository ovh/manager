import { VCDCompute, VCDStorage } from '@ovh-ux/manager-module-vcd-api';
import {
  VDC_RESOURCE_MIN_QUANTITY,
  FREESPARE_REGEX,
  VDC_RESOURCE_DELETION_TOOLTIPS,
} from './vdcResourceDeletion.constants';

export type VdcResourceDeletionParams =
  | {
      type: 'compute';
      resourceList: VCDCompute[];
      resource?: VCDCompute;
    }
  | {
      type: 'storage';
      resourceList: VCDStorage[];
      resource?: VCDStorage;
    };

type VdcResourceDeletionResult = {
  isDeletable: boolean;
  tooltipTranslationKey: string;
};

export const isVdcFreespareResource = (resource: VCDCompute | VCDStorage) => {
  return FREESPARE_REGEX.test(resource.currentState.profile);
};

export const isVdcResourceDeletable = ({
  type,
  resourceList,
  resource,
}: VdcResourceDeletionParams): VdcResourceDeletionResult => {
  const tooltips = VDC_RESOURCE_DELETION_TOOLTIPS[type];

  const result: VdcResourceDeletionResult = {
    isDeletable: false,
    tooltipTranslationKey: VDC_RESOURCE_DELETION_TOOLTIPS.default,
  };

  if (!resourceList || !resource) {
    return result;
  }

  if (resourceList.length <= VDC_RESOURCE_MIN_QUANTITY) {
    return { ...result, tooltipTranslationKey: tooltips.minQuantity };
  }

  const freespareIds = resourceList
    .filter(isVdcFreespareResource)
    .map((r) => r.id);

  if (freespareIds.length && !freespareIds.includes(resource.id)) {
    return { ...result, tooltipTranslationKey: tooltips.freeFirst };
  }

  return { ...result, isDeletable: true, tooltipTranslationKey: '' };
};
