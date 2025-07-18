import { useDeferredValue, useEffect, useState } from 'react';
import {
  OsdsButton,
  OsdsIcon,
  OsdsInput,
  OsdsQuantity,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_SPINNER_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_INPUT_TYPE,
} from '@ovhcloud/ods-components';

import { Trans, useTranslation } from 'react-i18next';
import { useProjectUrl } from '@ovh-ux/manager-react-components';
import { StepState } from '@/pages/new/hooks/useStep';
import { useRegionsQuota } from '@/api/hooks/useQuota';
import { useVolumeMaxSize } from '@/api/data/quota';
import { TRegion } from '@/api/data/regions';
import { TVolumeModel, useVolumePricing } from '@/api/hooks/useCatalog';
import { EncryptionType } from '@/api/select/volume';
import ExternalLink from '@/components/ExternalLink';

export const VOLUME_MIN_SIZE = 10; // 10 Gio
export const VOLUME_UNLIMITED_QUOTA = -1; // Should be 10 * 1024 (but API is wrong)

interface CapacityStepProps {
  projectId: string;
  region: TRegion;
  volumeType: TVolumeModel['name'];
  encryptionType: EncryptionType | null;
  step: StepState;
  onSubmit: (volumeCapacity: number) => void;
}

export function CapacityStep({
  projectId,
  region,
  volumeType,
  encryptionType,
  step,
  onSubmit,
}: Readonly<CapacityStepProps>) {
  const { t } = useTranslation('add');
  const { t: tStepper } = useTranslation('stepper');
  const { t: tGlobal } = useTranslation('global');

  const [volumeCapacity, setVolumeCapacity] = useState<number>(VOLUME_MIN_SIZE);
  const deferredVolumeCapacity = useDeferredValue(volumeCapacity);

  const { data } = useVolumePricing(
    projectId,
    region.name,
    volumeType,
    encryptionType,
    deferredVolumeCapacity,
  );

  const [maxSize, setMaxSize] = useState(0);
  const {
    data: regionQuotas,
    isLoading: isRegionQuotaLoading,
  } = useRegionsQuota(projectId, region.name);
  const projectUrl = useProjectUrl('public-cloud');
  const quotaUrl = `${projectUrl}/quota`;

  const isCapacityValid =
    volumeCapacity >= VOLUME_MIN_SIZE && volumeCapacity <= maxSize;

  const { volumeMaxSize, isLoading: isVolumeMaxSizeLoading } = useVolumeMaxSize(
    region.name,
  );

  const isLoading = isRegionQuotaLoading && isVolumeMaxSizeLoading;

  useEffect(() => {
    if (!isLoading) {
      let availableGigabytes = volumeMaxSize;
      if (
        regionQuotas?.volume &&
        regionQuotas.volume.maxGigabytes !== VOLUME_UNLIMITED_QUOTA
      ) {
        availableGigabytes = Math.min(
          volumeMaxSize,
          regionQuotas.volume.maxGigabytes - regionQuotas.volume.usedGigabytes,
        );
      }
      setMaxSize(availableGigabytes);
      if (volumeCapacity > availableGigabytes) {
        setVolumeCapacity(availableGigabytes);
      }
    }
  }, [isLoading]);

  if (isLoading) {
    return <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />;
  }

  return (
    <>
      <div className="flex flex-row items-center">
        <OsdsQuantity>
          <OsdsButton
            slot="minus"
            variant={ODS_BUTTON_VARIANT.flat}
            color={ODS_THEME_COLOR_INTENT.primary}
            size={ODS_BUTTON_SIZE.sm}
            text-align="center"
          >
            <OsdsIcon
              name={ODS_ICON_NAME.MINUS}
              size={ODS_ICON_SIZE.sm}
              className="mr-2 bg-white"
            />
          </OsdsButton>
          <OsdsInput
            type={ODS_INPUT_TYPE.number}
            value={volumeCapacity}
            color={
              isCapacityValid
                ? ODS_THEME_COLOR_INTENT.primary
                : ODS_THEME_COLOR_INTENT.error
            }
            onOdsValueChange={(event) => {
              setVolumeCapacity(Number(event.detail.value));
            }}
            min={VOLUME_MIN_SIZE}
            max={maxSize}
          />
          <OsdsButton
            slot="plus"
            variant={ODS_BUTTON_VARIANT.flat}
            color={ODS_THEME_COLOR_INTENT.primary}
            size={ODS_BUTTON_SIZE.sm}
            text-align="center"
          >
            <OsdsIcon
              className="mr-2 bg-white"
              name={ODS_ICON_NAME.PLUS}
              size={ODS_ICON_SIZE.xs}
            />
          </OsdsButton>
        </OsdsQuantity>
        <OsdsText
          className="ml-4"
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          size={ODS_THEME_TYPOGRAPHY_SIZE._400}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {t('pci_projects_project_storages_blocks_add_size_unit')}
        </OsdsText>
      </div>

      <div>
        {!!data?.bandwidth && data.isBandwidthDynamic && (
          <OsdsText
            level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
            size={ODS_THEME_TYPOGRAPHY_SIZE._400}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {t('pci_projects_project_storages_blocks_add_size_bandwidth', {
              bandwidth: data.bandwidth,
            })}
          </OsdsText>
        )}
        <br />
        {!!data?.iops && data.areIOPSDynamic && (
          <OsdsText
            level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
            size={ODS_THEME_TYPOGRAPHY_SIZE._400}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {t('pci_projects_project_storages_blocks_add_size_iops', {
              iops: data.iops,
            })}
          </OsdsText>
        )}
      </div>
      {!!data && (
        <OsdsText
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          size={ODS_THEME_TYPOGRAPHY_SIZE._400}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {t('pci_projects_project_storages_blocks_add_submit_price_text', {
            price: data.monthlyPrice.value,
          })}
        </OsdsText>
      )}
      <div className="my-6">
        {volumeCapacity < VOLUME_MIN_SIZE && (
          <div>
            <OsdsText
              level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
              size={ODS_THEME_TYPOGRAPHY_SIZE._200}
              color={ODS_THEME_COLOR_INTENT.error}
            >
              {tGlobal('common_field_error_min', {
                min: VOLUME_MIN_SIZE,
              })}
            </OsdsText>
          </div>
        )}
        {volumeCapacity > maxSize && (
          <div>
            <OsdsText
              level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
              size={ODS_THEME_TYPOGRAPHY_SIZE._200}
              color={ODS_THEME_COLOR_INTENT.error}
            >
              {tGlobal('common_field_error_max', {
                max: maxSize,
              })}
            </OsdsText>
          </div>
        )}
        <OsdsText
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          size={ODS_THEME_TYPOGRAPHY_SIZE._200}
          color={
            isCapacityValid
              ? ODS_THEME_COLOR_INTENT.text
              : ODS_THEME_COLOR_INTENT.error
          }
        >
          <Trans
            t={t}
            i18nKey="pci_projects_project_storages_blocks_add_size_help"
            components={{
              Link: <ExternalLink href={quotaUrl} />,
            }}
          />
        </OsdsText>
      </div>
      {isCapacityValid && !step.isLocked && (
        <div>
          <OsdsButton
            className="w-fit"
            size={ODS_BUTTON_SIZE.md}
            color={ODS_THEME_COLOR_INTENT.primary}
            onClick={() => onSubmit(volumeCapacity)}
          >
            {tStepper('common_stepper_next_button_label')}
          </OsdsButton>
        </div>
      )}
    </>
  );
}
