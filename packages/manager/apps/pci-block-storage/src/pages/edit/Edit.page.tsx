import { useEffect, useState } from 'react';
import { useHref, useNavigate, useParams } from 'react-router-dom';
import { Translation, useTranslation } from 'react-i18next';
import {
  useCatalogPrice,
  useNotifications,
  useProjectLocalRegions,
  useProjectUrl,
  useTranslatedMicroRegions,
} from '@ovh-ux/manager-react-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_TEXT_ALIGN,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_INPUT_SIZE,
  ODS_INPUT_TYPE,
  ODS_SKELETON_SIZE,
  ODS_SPINNER_SIZE,
  ODS_TEXT_LEVEL,
} from '@ovhcloud/ods-components';
import {
  OsdsBreadcrumb,
  OsdsButton,
  OsdsFormField,
  OsdsIcon,
  OsdsInput,
  OsdsQuantity,
  OsdsSkeleton,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { useProject } from '@ovh-ux/manager-pci-common';
import { VOLUME_MIN_SIZE, VOLUME_UNLIMITED_QUOTA } from '@/constants';
import ChipRegion from '@/components/edit/ChipRegion.component';
import { TVolume } from '@/api/data/volume';
import {
  useGetPrices,
  useUpdateVolume,
  useVolume,
} from '@/api/hooks/useVolume';
import HidePreloader from '@/core/HidePreloader';
import { useVolumeMaxSize } from '@/api/data/quota';
import { useRegionsQuota } from '@/api/hooks/useQuota';

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

export default function EditPage() {
  const { t } = useTranslation();
  const { t: tEdit } = useTranslation('edit');
  const { t: tVolumeEdit } = useTranslation('volume-edit');
  const { t: tGlobal } = useTranslation('global');
  const { t: tStepper } = useTranslation('stepper');

  const navigate = useNavigate();
  const { addError, addSuccess } = useNotifications();
  const onClose = () => navigate('..');
  const backHref = useHref('..');

  const [errorState, setErrorState] = useState({
    isMinError: false,
    isMaxError: false,
  });

  const { projectId, volumeId } = useParams();

  const projectUrl = useProjectUrl('public-cloud');
  const { data: project } = useProject(projectId || '');
  const catalogPrice = useGetPrices(projectId, volumeId);
  const { translateMicroRegion } = useTranslatedMicroRegions();

  const { getTextPrice } = useCatalogPrice(3);

  const {
    data: volume,
    isLoading: isLoadingVolume,
    isPending: isPendingVolume,
  } = useVolume(projectId, volumeId);

  const { volumeMaxSize } = useVolumeMaxSize(volume?.region);

  const {
    data: localRegions,
    isPending: isPendingLocal,
    isLoading: isLoadingLocal,
  } = useProjectLocalRegions(projectId || '');

  const [formState, setFormState] = useState<TFormState>({
    name: volume?.name,
    size: {
      value: volume?.size || VOLUME_MIN_SIZE,
      min: VOLUME_MIN_SIZE,
      max: volumeMaxSize,
    },
    bootable: volume?.bootable || false,
    isInitialized: false,
  });

  const { updateVolume, isPending: isUpdatePending } = useUpdateVolume({
    projectId,
    volumeToEdit: {
      name: formState.name,
      size: formState.size.value,
      bootable: formState.bootable,
    } as TVolume,
    originalVolume: volume,
    onError(err: Error) {
      onClose();
      addError(
        <Translation ns="edit">
          {(_t) =>
            _t('pci_projects_project_storages_blocks_block_edit_error_put', {
              volume: volume?.name,
              message: err?.message,
            })
          }
        </Translation>,
        true,
      );
    },
    onSuccess() {
      onClose();
      addSuccess(
        <Translation ns="edit">
          {(_t) =>
            _t(
              'pci_projects_project_storages_blocks_block_edit_success_message',
              {
                volume: volume?.name,
              },
            )
          }
        </Translation>,
        true,
      );
    },
  });

  const { data: regionQuota, isPending: isPendingQuota } = useRegionsQuota(
    projectId,
    volume?.region,
  );

  const getMaxSize = (_volume: TVolume) => {
    if (regionQuota) {
      if (
        regionQuota.volume &&
        regionQuota.volume.maxGigabytes !== VOLUME_UNLIMITED_QUOTA
      ) {
        const availableGigabytes =
          regionQuota.volume.maxGigabytes - regionQuota.volume.usedGigabytes;
        return Math.min(_volume.size + availableGigabytes, volumeMaxSize);
      }
    }
    return volumeMaxSize;
  };

  const getVolumePriceEstimationFromCatalog = (
    price: { priceInUcents: number },
    volumeSize: number,
  ) => {
    const hourlyEstimation = volumeSize * price.priceInUcents;
    const monthlyEstimation = hourlyEstimation * 30 * 24;

    return {
      hourly: hourlyEstimation,
      monthly: monthlyEstimation,
    };
  };

  const isLoading =
    isLoadingVolume ||
    isPendingVolume ||
    isPendingLocal ||
    isLoadingLocal ||
    isPendingQuota;

  useEffect(() => {
    if (volume && regionQuota) {
      setFormState({
        name: volume.name,
        size: {
          value: volume.size,
          min: volume.size,
          max: getMaxSize(volume),
        },
        bootable: volume.bootable,
        isInitialized: true,
      });
    }
  }, [volume, regionQuota]);

  useEffect(() => {
    const { min, max, value } = formState.size;
    setErrorState({ isMinError: value < min, isMaxError: value > max });
  }, [formState]);

  const onEdit = () => {
    if (formState.name && !errorState.isMaxError && !errorState.isMinError) {
      updateVolume();
    }
  };

  const estimatedPrice =
    catalogPrice &&
    formState.size.value >= 0 &&
    getVolumePriceEstimationFromCatalog(catalogPrice, formState.size.value);
  const hasError = errorState.isMinError || errorState.isMaxError;

  return (
    <>
      <HidePreloader />
      {project && (
        <OsdsBreadcrumb
          items={[
            {
              href: projectUrl,
              label: project.description,
            },
            {
              label: t('pci_projects_project_storages_blocks_title'),
              href: backHref,
            },
            {
              label: volume?.name || '…',
              disabled: true,
            },
            {
              label: tEdit(
                'pci_projects_project_storages_blocks_block_edit_title',
              ),
            },
          ]}
        />
      )}

      {isLoading || isUpdatePending || !formState.isInitialized ? (
        <OsdsSpinner
          size={ODS_SPINNER_SIZE.md}
          inline
          className="mt-12"
          data-testid="editPage-spinner"
        />
      ) : (
        <>
          <div className="header mb-6 mt-8">
            <div className="flex items-center justify-between">
              <OsdsText
                level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
                size={ODS_THEME_TYPOGRAPHY_SIZE._600}
                color={ODS_THEME_COLOR_INTENT.primary}
              >
                {tEdit('pci_projects_project_storages_blocks_block_edit_title')}
              </OsdsText>
            </div>
          </div>

          <OsdsText
            level={ODS_THEME_TYPOGRAPHY_LEVEL.caption}
            color={ODS_THEME_COLOR_INTENT.promotion}
            size={ODS_THEME_TYPOGRAPHY_SIZE._100}
            className="font-bold"
          >
            {t('pci_projects_project_storages_blocks_region_label')}
          </OsdsText>
          <div className="flex">
            <OsdsText
              level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
              size={ODS_THEME_TYPOGRAPHY_SIZE._400}
              color={ODS_THEME_COLOR_INTENT.text}
              className="mr-4"
            >
              {translateMicroRegion(volume?.region)}
            </OsdsText>
            <ChipRegion region={volume?.region} localRegions={localRegions} />
          </div>

          <OsdsText
            level={ODS_THEME_TYPOGRAPHY_LEVEL.caption}
            color={ODS_THEME_COLOR_INTENT.promotion}
            size={ODS_THEME_TYPOGRAPHY_SIZE._100}
            className="font-bold block mt-8"
          >
            {tVolumeEdit(
              'pci_projects_project_storages_blocks_block_volume-edit_type_label',
            )}
          </OsdsText>
          <OsdsText
            level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
            size={ODS_THEME_TYPOGRAPHY_SIZE._400}
            color={ODS_THEME_COLOR_INTENT.text}
            data-testid="editPage-text_volumeType"
          >
            {volume?.type}
          </OsdsText>

          <OsdsFormField className="mt-8">
            <OsdsText
              level={ODS_TEXT_LEVEL.caption}
              size={ODS_THEME_TYPOGRAPHY_SIZE._100}
              color={ODS_THEME_COLOR_INTENT.text}
              className="font-bold"
              slot="label"
            >
              {tVolumeEdit(
                'pci_projects_project_storages_blocks_block_volume-edit_name_label',
              )}
            </OsdsText>

            <OsdsInput
              type={ODS_INPUT_TYPE.text}
              default-value={volume?.name}
              value={formState.name}
              className="w-1/3"
              color={
                formState.name
                  ? ODS_THEME_COLOR_INTENT.primary
                  : ODS_THEME_COLOR_INTENT.error
              }
              onOdsValueChange={(event) =>
                setFormState({ ...formState, name: event.detail.value })
              }
              data-testid="editPage-input_volumeName"
            />
            {!formState.name && (
              <OsdsText
                level={ODS_TEXT_LEVEL.body}
                size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                color={ODS_THEME_COLOR_INTENT.error}
              >
                {tStepper('common_field_error_required')}
              </OsdsText>
            )}
          </OsdsFormField>

          <div className="flex items-end mt-8 mb-3">
            <OsdsFormField>
              <OsdsText
                level={ODS_TEXT_LEVEL.caption}
                size={ODS_THEME_TYPOGRAPHY_SIZE._100}
                color={ODS_THEME_COLOR_INTENT.text}
                className="font-bold"
                slot="label"
              >
                {tVolumeEdit(
                  'pci_projects_project_storages_blocks_block_volume-edit_size_label',
                )}
              </OsdsText>

              <OsdsQuantity>
                <OsdsButton
                  slot="minus"
                  size={ODS_BUTTON_SIZE.sm}
                  color={ODS_THEME_COLOR_INTENT.primary}
                  variant={ODS_BUTTON_VARIANT.flat}
                  textAlign={ODS_BUTTON_TEXT_ALIGN.center}
                  {...(formState.size.value <= formState.size.min
                    ? { disabled: true }
                    : {})}
                >
                  <OsdsIcon
                    size={ODS_ICON_SIZE.sm}
                    name={ODS_ICON_NAME.MINUS}
                    color={ODS_THEME_COLOR_INTENT.default}
                    contrasted
                  />
                </OsdsButton>

                <OsdsInput
                  type={ODS_INPUT_TYPE.number}
                  color={
                    hasError
                      ? ODS_THEME_COLOR_INTENT.error
                      : ODS_THEME_COLOR_INTENT.primary
                  }
                  min={formState.size.min}
                  max={formState.size.max}
                  step={1}
                  value={formState.size.value}
                  default-value={formState.size.value}
                  size={ODS_INPUT_SIZE.md}
                  error={hasError}
                  onOdsValueChange={(event) => {
                    setFormState({
                      ...formState,
                      size: {
                        ...formState.size,
                        value: Number(event.detail.value),
                      },
                    });
                  }}
                  data-testid="editPage-input_volumeSize"
                />

                <OsdsButton
                  slot="plus"
                  size={ODS_BUTTON_SIZE.sm}
                  color={ODS_THEME_COLOR_INTENT.primary}
                  variant={ODS_BUTTON_VARIANT.flat}
                  textAlign={ODS_BUTTON_TEXT_ALIGN.center}
                  {...(formState.size.value >= formState.size.max
                    ? { disabled: true }
                    : {})}
                >
                  <OsdsIcon
                    size={ODS_ICON_SIZE.sm}
                    name={ODS_ICON_NAME.PLUS}
                    color={ODS_THEME_COLOR_INTENT.default}
                    contrasted
                  ></OsdsIcon>
                </OsdsButton>
              </OsdsQuantity>
            </OsdsFormField>

            <OsdsText
              level={ODS_TEXT_LEVEL.body}
              size={ODS_THEME_TYPOGRAPHY_SIZE._400}
              color={ODS_THEME_COLOR_INTENT.text}
              className="pl-4 inline"
            >
              {tVolumeEdit(
                'pci_projects_project_storages_blocks_block_volume-edit_size_unit',
              )}
            </OsdsText>
          </div>

          {!hasError &&
            (estimatedPrice?.monthly ? (
              <OsdsText
                level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                color={ODS_THEME_COLOR_INTENT.text}
                className="block mb-6"
              >
                {tVolumeEdit(
                  'pci_projects_project_storages_blocks_block_volume-edit_price_text',
                  { price: getTextPrice(estimatedPrice.monthly) },
                )}
              </OsdsText>
            ) : (
              <OsdsSkeleton inline size={ODS_SKELETON_SIZE.md} />
            ))}

          {errorState.isMinError && (
            <OsdsText
              level={ODS_TEXT_LEVEL.caption}
              size={ODS_THEME_TYPOGRAPHY_SIZE._100}
              color={ODS_THEME_COLOR_INTENT.error}
              className="block mb-2"
            >
              {tGlobal('common_field_error_min', { min: formState.size.min })}
            </OsdsText>
          )}

          {errorState.isMaxError && (
            <OsdsText
              level={ODS_TEXT_LEVEL.caption}
              size={ODS_THEME_TYPOGRAPHY_SIZE._100}
              color={ODS_THEME_COLOR_INTENT.error}
              className="block mb-2"
            >
              {tGlobal('common_field_error_max', { max: formState.size.max })}
            </OsdsText>
          )}

          <OsdsText
            level={ODS_TEXT_LEVEL.caption}
            size={ODS_THEME_TYPOGRAPHY_SIZE._100}
            color={
              hasError
                ? ODS_THEME_COLOR_INTENT.error
                : ODS_THEME_COLOR_INTENT.primary
            }
            className="block"
          >
            {tVolumeEdit(
              'pci_projects_project_storages_blocks_block_volume-edit_size_help',
            )}
          </OsdsText>

          <div className="flex mt-8 gap-4">
            <OsdsButton
              color={ODS_THEME_COLOR_INTENT.primary}
              variant={ODS_BUTTON_VARIANT.stroked}
              onClick={() => onClose()}
              slot="actions"
            >
              {tVolumeEdit(
                'pci_projects_project_storages_blocks_block_volume-edit_cancel_label',
              )}
            </OsdsButton>

            <OsdsButton
              color={ODS_THEME_COLOR_INTENT.primary}
              onClick={() => onEdit()}
              {...(formState.name && !hasError ? {} : { disabled: true })}
              slot="actions"
              data-testid="editPage-button_submit"
            >
              {tEdit(
                'pci_projects_project_storages_blocks_block_edit_submit_label',
              )}
            </OsdsButton>
          </div>
        </>
      )}
    </>
  );
}
