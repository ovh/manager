import { FormEvent, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  OdsButton,
  OdsFormField,
  OdsInput,
  OdsText,
  OdsQuantity,
} from '@ovhcloud/ods-components/react';
import { useTranslatedMicroRegions } from '@ovh-ux/manager-react-components';
import { TVolume } from '@/api/data/snapshots';
import PriceEstimate from './PriceEstimate.component';
import BadgeRegionType from './BadgeRegionType.component';
import { useVolumeCatalog } from '@/api/hooks/useCatalog';
import { getVolumeMaxSize } from '@/api/data/quota';
import { useRegionsQuota } from '@/api/hooks/useQuota';
import { VOLUME_MIN_SIZE, VOLUME_UNLIMITED_QUOTA } from '@/constants';
import { TVolumePricing } from '@/api/data/catalog';

const DEFAULT_MAX_SIZE = 4000;

export interface PciStorageVolumeEditProps {
  projectId: string;
  volume: TVolume;
  suggestedName?: string;
  submitLabel: string;
  onSubmit: (editedVolume: Partial<TVolume>) => void;
  onCancel: () => void;
}

export default function PciStorageVolumeEdit({
  projectId,
  volume,
  suggestedName,
  submitLabel,
  onSubmit,
  onCancel,
}: Readonly<PciStorageVolumeEditProps>) {
  const { t } = useTranslation(['volume-edit', 'global']);
  const { translateMicroRegion } = useTranslatedMicroRegions();
  const { data: catalog } = useVolumeCatalog(projectId);
  const { region, pricing } = useMemo(() => {
    if (!catalog || !volume) {
      return { region: null, pricing: null };
    }
    const catalogVolume =
      catalog.models.find((addon) => addon.name === volume.type) || null;
    const regionPricing = (catalogVolume?.pricings || []).find((p) =>
      p.regions.includes(volume.region),
    );
    return {
      region: catalog.regions.find((r) => r.name === volume.region) || null,
      pricing: regionPricing as TVolumePricing,
    };
  }, [catalog, volume]);
  const { data: regionQuota } = useRegionsQuota(projectId, volume?.region);
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
    nameIsMissing: !volumeName,
    isMinError: volumeSize < minVolumeSize,
    isMaxError: volumeSize > maxVolumeSize,
  };
  const hasSizeError = errorState.isMinError || errorState.isMaxError;
  const hasError = hasSizeError || errorState.nameIsMissing;

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
        <OdsText className={'font-bold-class text-critical'} preset="caption">
          {t(
            'pci_projects_project_storages_blocks_block_volume-edit_region_label',
          )}
        </OdsText>
        <div className="flex items-center gap-4">
          <OdsText preset="span">
            {translateMicroRegion(volume?.region)}
          </OdsText>
          {!!region && <BadgeRegionType regionType={region.type} />}
        </div>
      </OdsFormField>
      <OdsFormField className="my-4 w-full">
        <OdsText className={'font-bold-class text-critical'} preset="caption">
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
        <OdsInput
          name="volume_name"
          className="w-[30em] max-w-full"
          value={volumeName}
          hasError={errorState.nameIsMissing}
          onOdsChange={(e) => setVolumeName(e.detail.value as string)}
        />
        {errorState.nameIsMissing && (
          <OdsText className="text-critical">
            {t('common_field_error_required', { ns: 'global' })}
          </OdsText>
        )}
      </OdsFormField>
      <div className="flex items-end mt-6 mb-3">
        <OdsFormField>
          <OdsText
            className={`font-bold-class ${hasSizeError ? 'text-critical' : ''}`}
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
          {t('common_field_error_min', { min: minVolumeSize, ns: 'global' })}
        </OdsText>
      )}

      {errorState.isMaxError && (
        <OdsText className="block mb-2 text-critical" preset="caption">
          {t('common_field_error_max', { max: maxVolumeSize, ns: 'global' })}
        </OdsText>
      )}

      <OdsText
        preset="caption"
        className={`block ${hasSizeError ? 'text-critical' : ''}`}
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
        <OdsButton
          type="submit"
          label={submitLabel}
          isDisabled={hasError}
        ></OdsButton>
      </div>
    </form>
  );
}
