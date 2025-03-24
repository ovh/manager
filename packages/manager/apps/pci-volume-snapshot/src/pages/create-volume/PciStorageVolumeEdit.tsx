import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  OdsButton,
  OdsFormField,
  OdsInput,
  OdsText,
  OdsSpinner,
  OdsQuantity,
} from '@ovhcloud/ods-components/react';
import { useTranslatedMicroRegions } from '@ovh-ux/manager-react-components';
// import {
//   PCICommonContext,
//   usePCICommonContextFactory,
//   useProject,
// } from '@ovh-ux/manager-pci-common';
import { TVolume } from '@/api/data/snapshots';
import PriceEstimate from './PriceEstimate';
import { useVolumeCatalog } from '@/api/hooks/useCatalog';
import { RegionQuota, useVolumeMaxSize } from '@/api/data/quota';
import { useHas3AZRegion } from '@/api/hooks/useHas3AZRegion';
import { useRegionsQuota } from '@/api/hooks/useQuota';
import { VOLUME_MIN_SIZE, VOLUME_UNLIMITED_QUOTA } from '@/constants';

type TFormState = {
  name: string;
  size: {
    value: number;
    min: number;
    max: number;
  };
  bootable: boolean;
  isInitialized: boolean;
};

export function getRegionMaxSize(
  volumeMaxSize: number,
  volume: TVolume,
  regionQuota: RegionQuota | null = null,
): number {
  if (!regionQuota || !regionQuota.volume) {
    return volumeMaxSize;
  }
  if (regionQuota.volume.maxGigabytes === VOLUME_UNLIMITED_QUOTA) {
    return volumeMaxSize;
  }
  const availableGigabytes =
    regionQuota.volume.maxGigabytes - regionQuota.volume.usedGigabytes;
  return Math.min(volume.size + availableGigabytes, volumeMaxSize);
}

export interface PciStorageVolumeEditProps {
  // isLoading: boolean;
  projectId: string;
  volume: TVolume;
  suggestedName?: string;
  submitLabel: string;
  onSubmit: () => void;
  onCancel: () => void;
}

export default function PciStorageVolumeEdit({
  // isLoading,
  projectId,
  volume,
  suggestedName,
  submitLabel,
  onSubmit,
  onCancel,
}: Readonly<PciStorageVolumeEditProps>) {
  const { t } = useTranslation('volume-edit');
  // const [name, setName] = useState(suggestedName || volume.name || '');

  const { volumeMaxSize } = useVolumeMaxSize(volume?.region);

  const [formState, setFormState] = useState<TFormState>({
    name: suggestedName || volume.name || '',
    size: {
      value: volume?.size || VOLUME_MIN_SIZE,
      min: VOLUME_MIN_SIZE,
      max: volumeMaxSize,
    },
    bootable: volume?.bootable || false,
    isInitialized: false,
  });

  // const projectUrl = useProjectUrl('public-cloud');
  // const { data: project } = useProject(projectId || '');
  const { translateMicroRegion } = useTranslatedMicroRegions();

  const { data: catalog } = useVolumeCatalog(projectId);
  const { has3AZ } = useHas3AZRegion(projectId);
  // const pciCommonProperties = usePCICommonContextFactory({ has3AZ });

  const catalogVolume = useMemo(() => {
    if (!!catalog && !!volume) {
      return catalog.models.find((addon) => addon.name === volume.type) || null;
    }
    return null;
  }, [catalog, volume]);

  const region = useMemo(() => {
    if (!!catalog && !!volume) {
      return catalog.regions.find((r) => r.name === volume.region) || null;
    }
    return null;
  }, [catalog, volume]);

  const pricing = useMemo(
    () =>
      catalogVolume
        ? catalogVolume.pricings.find((p) => p.regions.includes(volume.region))
        : null,
    [catalogVolume, volume],
  );

  const { data: regionQuota, isPending: isPendingQuota } = useRegionsQuota(
    projectId,
    volume?.region,
  );

  useEffect(() => {
    if (volume && regionQuota) {
      setFormState({
        name: volume.name,
        size: {
          value: volume.size,
          min: volume.size,
          max: getRegionMaxSize(volumeMaxSize, volume, regionQuota),
        },
        bootable: volume.bootable,
        isInitialized: true,
      });
    }
  }, [volume, regionQuota]);

  // useEffect(() => {
  //   const { min, max, value } = formState.size;
  //   setErrorState({ isMinError: value < min, isMaxError: value > max });
  // }, [formState]);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onSubmit();
    },
    [onSubmit],
  );

  console.group('[default] PciStorageVolumeEdit');
  console.log('volume: ', volume);
  console.log('pricing: ', pricing);
  console.log('formState: ', formState);
  console.groupEnd();

  const errorState = {
    isMinError: false,
    isMaxError: false,
  };
  const hasError = false;

  return (
    <form className="flex flex-col" onSubmit={handleSubmit}>
      <OdsFormField className="my-4 w-full">
        <OdsText className={'font-bold-class'} preset="caption">
          {t(
            'pci_projects_project_storages_blocks_block_volume-edit_region_label',
          )}
        </OdsText>
        <OdsText>
          {translateMicroRegion(volume?.region)} PRICE: {formState.size.value}
        </OdsText>
      </OdsFormField>
      <OdsFormField className="my-4 w-full">
        <OdsText className={'font-bold-class'} preset="caption">
          {t(
            'pci_projects_project_storages_blocks_block_volume-edit_type_label',
          )}
        </OdsText>
        <OdsText>{volume.type}</OdsText>
      </OdsFormField>
      <OdsFormField className="my-4 w-full">
        <OdsText className={'font-bold-class'} preset="caption">
          {t(
            'pci_projects_project_storages_blocks_block_volume-edit_name_label',
          )}
        </OdsText>
        <OdsInput name={'nom-du-volume-todo'} value={formState.name} />
      </OdsFormField>
      <div className="flex items-end mt-8 mb-3">
        <OdsFormField>
          <OdsText className={'font-bold-class'} preset="caption" slot="label">
            {t(
              'pci_projects_project_storages_blocks_block_volume-edit_size_label',
            )}
          </OdsText>
          <OdsQuantity name="volume_size" value={volume.size} min={0} />
        </OdsFormField>
        <OdsText>
          {t(
            'pci_projects_project_storages_blocks_block_volume-edit_size_unit',
          )}
        </OdsText>
      </div>

      {!hasError && !!catalogVolume && (
        <div className="mb-6">
          {pricing && (
            <PriceEstimate
              volumeCapacity={formState.size.value}
              pricing={pricing}
            />
          )}
        </div>
      )}

      {errorState.isMinError && (
        <OdsText
          level="caption"
          size="_100"
          color="error"
          className="block mb-2"
        >
          {t('common_field_error_min', { min: formState.size.min })}
        </OdsText>
      )}

      {errorState.isMaxError && (
        <OdsText
          level="caption"
          size="_100"
          color="error"
          className="block mb-2"
        >
          {t('common_field_error_max', { max: formState.size.max })}
        </OdsText>
      )}

      <OdsText
        level="caption"
        size="_100"
        color={hasError ? 'error' : 'primary'}
        className="block"
      >
        {t('pci_projects_project_storages_blocks_block_volume-edit_size_help')}
      </OdsText>

      <div className="flex mt-8 gap-4">
        <OdsButton
          type="button"
          variant={'outline'}
          onClick={onCancel}
          label={t(
            'pci_projects_project_storages_blocks_block_volume-edit_cancel_label',
          )}
        ></OdsButton>
        <OdsButton type="submit" label={submitLabel}></OdsButton>
      </div>
    </form>
  );
}
