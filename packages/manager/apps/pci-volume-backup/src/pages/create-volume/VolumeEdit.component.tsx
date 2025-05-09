import { FormEvent, useCallback, useMemo, useState } from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import {
  OdsButton,
  OdsFormField,
  OdsInput,
  OdsText,
  OdsQuantity,
} from '@ovhcloud/ods-components/react';
import { useTranslatedMicroRegions } from '@ovh-ux/manager-react-components';
import { TRegion, TVolume, TVolumePricing } from '@/data/api/api.types';
import PriceEstimate from './PriceEstimate.component';
import BadgeRegionType from './BadgeRegionType.component';
import { useVolumeCatalog } from '@/data/hooks/useCatalog';
import { getVolumeMaxSize } from '@/data/api/quota';
import { useRegionsQuota } from '@/data/hooks/useQuota';
import {
  VOLUME_MIN_SIZE,
  DEFAULT_MAX_SIZE,
  VOLUME_NAME_MAX_LENGTH,
} from '@/constants';

function useVolumeEditData(
  projectId: string,
  volume: TVolume,
): {
  region: TRegion | null;
  pricing: TVolumePricing | null;
  has3Az: boolean;
} {
  const { data: catalog } = useVolumeCatalog(projectId);

  const { region, pricing } = useMemo(() => {
    if (!catalog || !volume) {
      return { region: null, pricing: null, has3Az: false };
    }
    const catalogVolume =
      catalog.models.find((addon) => addon.name === volume.type) || null;
    const regionPricing = (catalogVolume?.pricings || []).find((p) =>
      p.regions.includes(volume.region),
    );
    return {
      region: catalog.regions.find((r) => r.name === volume.region) || null,
      pricing: regionPricing || null,
    };
  }, [catalog, volume]);

  const has3Az =
    !!catalog &&
    catalog.filters.deployment.some((d) => d.name === 'region-3-az');

  return { region, pricing, has3Az };
}

export interface VolumeEditProps {
  projectId: string;
  volume: TVolume;
  suggestedName?: string;
  sizeDisabled?: boolean;
  submitLabel: string;
  onSubmit: (editedVolume: Partial<TVolume>) => void;
  onCancel: () => void;
}

export default function VolumeEdit({
  projectId,
  volume,
  suggestedName,
  sizeDisabled,
  submitLabel,
  onSubmit,
  onCancel,
}: Readonly<VolumeEditProps>) {
  const { t } = useTranslation(['volume-edit', 'pci-common']);
  const { translateMicroRegion } = useTranslatedMicroRegions();
  const { region, pricing, has3Az } = useVolumeEditData(projectId, volume);
  const { data: regionQuota } = useRegionsQuota(projectId, volume.region);
  const [volumeSize, setVolumeSize] = useState(volume.size || VOLUME_MIN_SIZE);
  const minVolumeSize = volume.size;
  const maxVolumeSize = useMemo(() => {
    if (!regionQuota || !pricing) {
      return DEFAULT_MAX_SIZE;
    }
    return getVolumeMaxSize(regionQuota, pricing);
  }, [regionQuota, pricing]);
  const [volumeName, setVolumeName] = useState(
    suggestedName || volume.name || '',
  );

  const errorState = {
    nameIsTooLong: volumeName.length > VOLUME_NAME_MAX_LENGTH,
    isMinError: volumeSize < minVolumeSize,
    isMaxError: volumeSize > maxVolumeSize,
  };
  const hasNameError = errorState.nameIsTooLong;
  const hasSizeError = errorState.isMinError || errorState.isMaxError;
  const hasError = hasNameError || hasSizeError;

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (hasError) {
        return;
      }
      onSubmit({
        name: volumeName,
        size: volumeSize,
        bootable: volume.bootable,
      });
    },
    [onSubmit, volume, hasError, volumeName, volumeSize],
  );

  return (
    <form className="flex flex-col" onSubmit={handleSubmit}>
      <OdsFormField className="my-4 w-full">
        <OdsText className="fw-bold text-critical" preset="caption">
          {t(
            'pci_projects_project_storages_blocks_block_volume-edit_region_label',
          )}
        </OdsText>
        <div className="flex items-center gap-4">
          <OdsText preset="span">
            {translateMicroRegion(volume?.region)}
          </OdsText>
          {!!region && (
            <BadgeRegionType
              regionType={region.type}
              are3azRegionAvailable={has3Az}
            />
          )}
        </div>
      </OdsFormField>
      <OdsFormField className="my-4 w-full">
        <OdsText className="fw-bold text-critical" preset="caption">
          {t(
            'pci_projects_project_storages_blocks_block_volume-edit_type_label',
          )}
        </OdsText>
        <OdsText>{volume.type}</OdsText>
      </OdsFormField>
      <OdsFormField className="my-4 w-full">
        <OdsText className="fw-bold" preset="caption">
          {t(
            'pci_projects_project_storages_blocks_block_volume-edit_name_label',
          )}
        </OdsText>
        <OdsInput
          name="volume_name"
          className="w-[30em] max-w-full"
          value={volumeName}
          hasError={hasNameError}
          onOdsChange={(e) => setVolumeName(e.detail.value as string)}
        />
        {errorState.nameIsTooLong && (
          <OdsText className="text-critical leading-[0.8]" preset="caption">
            {t('common_field_error_maxlength', {
              maxlength: VOLUME_NAME_MAX_LENGTH,
              ns: 'pci-common',
            })}
          </OdsText>
        )}
      </OdsFormField>
      <div className="flex items-end mt-6 mb-3">
        <OdsFormField>
          <OdsText
            className={clsx('fw-bold', {
              'text-critical': hasSizeError,
            })}
            preset="caption"
            slot="label"
          >
            {t(
              'pci_projects_project_storages_blocks_block_volume-edit_size_label',
            )}
          </OdsText>
          <div className="flex items-center">
            <OdsQuantity
              name="volume_size"
              value={volumeSize}
              min={minVolumeSize}
              max={maxVolumeSize}
              hasError={hasSizeError}
              isDisabled={sizeDisabled}
              onOdsChange={(e) => setVolumeSize(e.detail.value as number)}
            />
            <OdsText className="pl-4 inline">
              {t(
                'pci_projects_project_storages_blocks_block_volume-edit_size_unit',
              )}
            </OdsText>
          </div>
        </OdsFormField>
      </div>

      {!hasSizeError && !!pricing && (
        <div className="mb-4">
          {pricing && (
            <PriceEstimate volumeCapacity={volumeSize} pricing={pricing} />
          )}
        </div>
      )}

      {errorState.isMinError && (
        <OdsText className="block mb-2 text-critical" preset="caption">
          {t('common_field_error_min', {
            min: minVolumeSize,
            ns: 'pci-common',
          })}
        </OdsText>
      )}

      {errorState.isMaxError && (
        <OdsText className="block mb-2 text-critical" preset="caption">
          {t('common_field_error_max', {
            max: maxVolumeSize,
            ns: 'pci-common',
          })}
        </OdsText>
      )}

      <OdsText
        preset="caption"
        className={clsx('block', { 'text-critical': hasSizeError })}
      >
        {t('pci_projects_project_storages_blocks_block_volume-edit_size_help')}
      </OdsText>

      <div className="flex mt-8 gap-4">
        <OdsButton
          type="button"
          variant="outline"
          onClick={onCancel}
          label={t(
            'pci_projects_project_storages_blocks_block_volume-edit_cancel_label',
          )}
        />
        <OdsButton type="submit" label={submitLabel} isDisabled={hasError} />
      </div>
    </form>
  );
}
