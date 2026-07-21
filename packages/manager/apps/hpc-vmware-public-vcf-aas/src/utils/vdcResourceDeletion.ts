import { VCDCompute, VCDStorage } from '@ovh-ux/manager-module-vcd-api';
import {
  VDC_RESOURCE_MIN_QUANTITY,
  FREESPARE_REGEX,
  VDC_RESOURCE_DELETION_TOOLTIPS,
  STANDARD_STORAGE_REGEX,
} from './vdcResourceDeletion.constants';

type VdcResource = VCDCompute | VCDStorage;

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

const deletable = (): VdcResourceDeletionResult => ({
  isDeletable: true,
  tooltipTranslationKey: '',
});

const notDeletable = (
  tooltipTranslationKey: string,
): VdcResourceDeletionResult => ({
  isDeletable: false,
  tooltipTranslationKey,
});

export const isVdcFreespareResource = (resource: VdcResource) =>
  FREESPARE_REGEX.test(resource.currentState.profile);

const checkComputeDeletable = (
  computeList: VdcResource[],
  compute: VdcResource,
): VdcResourceDeletionResult => {
  const freespareIds = computeList
    .filter(isVdcFreespareResource)
    .map((r) => r.id);

  return freespareIds.length > 0 && !freespareIds.includes(compute.id)
    ? notDeletable(VDC_RESOURCE_DELETION_TOOLTIPS.compute.freeFirst)
    : deletable();
};

const checkStorageDeletable = (
  storage: VCDStorage,
): VdcResourceDeletionResult => {
  const isStandardStorage = STANDARD_STORAGE_REGEX.test(
    storage.currentState.profile,
  );

  return isStandardStorage
    ? deletable()
    : notDeletable(VDC_RESOURCE_DELETION_TOOLTIPS.storage.notStandard);
};

export const isVdcResourceDeletable = (
  params: VdcResourceDeletionParams,
): VdcResourceDeletionResult => {
  const { type, resourceList, resource } = params;

  if (!resourceList || !resource) {
    return notDeletable(VDC_RESOURCE_DELETION_TOOLTIPS.default);
  }

  if (resourceList.length <= VDC_RESOURCE_MIN_QUANTITY) {
    return notDeletable(VDC_RESOURCE_DELETION_TOOLTIPS[type].minQuantity);
  }

  switch (type) {
    case 'compute':
      return checkComputeDeletable(resourceList, resource);
    case 'storage':
      return checkStorageDeletable(resource);
    default:
      return notDeletable(VDC_RESOURCE_DELETION_TOOLTIPS.default);
  }
};
