import { useEffect, useMemo, useState } from 'react';
import { useHref, useNavigate, useParams } from 'react-router-dom';
import { Trans, Translation, useTranslation } from 'react-i18next';

import {
  Headers,
  useNotifications,
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
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  PCICommonContext,
  usePCICommonContextFactory,
  useProject,
} from '@ovh-ux/manager-pci-common';
import { VOLUME_MIN_SIZE, VOLUME_UNLIMITED_QUOTA } from '@/constants';
import ChipRegion from '@/components/edit/ChipRegion.component';
import {
  useUpdateVolume,
  useVolume,
  UseVolumeResult,
} from '@/api/hooks/useVolume';
import HidePreloader from '@/core/HidePreloader';
import { useVolumeMaxSize } from '@/api/data/quota';
import { useRegionsQuota } from '@/api/hooks/useQuota';
import { useVolumeCatalog } from '@/api/hooks/useCatalog';
import { useHas3AZRegion } from '@/api/hooks/useHas3AZRegion';
import ExternalLink from '@/components/ExternalLink';
import { ButtonLink } from '@/components/button-link/ButtonLink';
import { useTrackBanner } from '@/hooks/useTrackBanner';
import { Button } from '@/components/button/Button';

type TFormState = {
  name: string;
  size: {
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

  const { projectId, volumeId } = useParams();

  const projectUrl = useProjectUrl('public-cloud');
  const quotaUrl = `${projectUrl}/quota`;
  const { data: project } = useProject(projectId || '');
  const { translateMicroRegion } = useTranslatedMicroRegions();

  const [size, setSize] = useState(VOLUME_MIN_SIZE);
  const {
    data: volume,
    isLoading: isLoadingVolume,
    isPending: isPendingVolume,
  } = useVolume(projectId, volumeId, size);
  const { data: catalog } = useVolumeCatalog(projectId);
  const { has3AZ } = useHas3AZRegion(projectId);
  const pciCommonProperties = usePCICommonContextFactory({ has3AZ });

  const region = useMemo(() => {
    if (!!catalog && !!volume) {
      return catalog.regions.find((r) => r.name === volume.region) || null;
    }
    return null;
  }, [catalog, volume]);

  const { volumeMaxSize } = useVolumeMaxSize(volume?.region);

  const [formState, setFormState] = useState<TFormState>({
    name: volume?.name,
    size: {
      min: VOLUME_MIN_SIZE,
      max: volumeMaxSize,
    },
    bootable: volume?.bootable || false,
    isInitialized: false,
  });

  const onTrackingBannerError = useTrackBanner(
    { type: 'error' },
    (err: Error) => {
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
      onClose();
    },
  );
  const onTrackingBannerSuccess = useTrackBanner({ type: 'success' }, () => {
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
    onClose();
  });
  const { updateVolume, isPending: isUpdatePending } = useUpdateVolume({
    projectId,
    volumeToEdit: {
      name: formState.name,
      size,
      bootable: formState.bootable,
    },
    originalVolume: volume,
    onError: onTrackingBannerError,
    onSuccess: onTrackingBannerSuccess,
  });

  const { data: regionQuota, isPending: isPendingQuota } = useRegionsQuota(
    projectId,
    volume?.region,
  );

  const getMaxSize = (_volume: UseVolumeResult) => {
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

  const isLoading = isLoadingVolume || isPendingVolume || isPendingQuota;

  useEffect(() => {
    if (volume && regionQuota) {
      setFormState({
        name: volume.name,
        size: {
          min: volume.size,
          max: getMaxSize(volume),
        },
        bootable: volume.bootable,
        isInitialized: true,
      });
    }
  }, [volume?.name, volume?.size, volume?.bootable, regionQuota]);

  useEffect(() => {
    if (volume?.size) setSize(volume.size);
  }, [volume?.size]);

  const errorState = useMemo(
    () => ({
      isMinError: size < formState.size.min,
      isMaxError: size > formState.size.max,
    }),
    [formState.size, size],
  );

  const actionValues = [volume?.region, volume?.type];
  const onEdit = () => {
    if (formState.name && !errorState.isMaxError && !errorState.isMinError) {
      updateVolume();
    }
  };
  const hasError = errorState.isMinError || errorState.isMaxError;

  return (
    <PCICommonContext.Provider value={pciCommonProperties}>
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
              <Headers
                title={tEdit(
                  'pci_projects_project_storages_blocks_block_edit_title',
                )}
              />
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
            {!!region && <ChipRegion region={region} />}
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
                  {...(size <= formState.size.min ? { disabled: true } : {})}
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
                  value={size}
                  default-value={size}
                  size={ODS_INPUT_SIZE.md}
                  error={hasError}
                  onOdsValueChange={(event) =>
                    setSize(Number(event.detail.value))
                  }
                  data-testid="editPage-input_volumeSize"
                />

                <OsdsButton
                  slot="plus"
                  size={ODS_BUTTON_SIZE.sm}
                  color={ODS_THEME_COLOR_INTENT.primary}
                  variant={ODS_BUTTON_VARIANT.flat}
                  textAlign={ODS_BUTTON_TEXT_ALIGN.center}
                  {...(size >= formState.size.max ? { disabled: true } : {})}
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

          {!hasError && (
            <div className="mb-6">
              {!!volume.monthlyPrice && (
                <OsdsText
                  level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                  size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                  color={ODS_THEME_COLOR_INTENT.text}
                >
                  {t(
                    'add:pci_projects_project_storages_blocks_add_submit_price_text',
                    {
                      price: volume.monthlyPrice.value,
                    },
                  )}
                </OsdsText>
              )}
            </div>
          )}

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
            <Trans
              t={tVolumeEdit}
              i18nKey="pci_projects_project_storages_blocks_block_volume-edit_size_help"
              components={{
                Link: <ExternalLink href={quotaUrl} />,
              }}
            />
          </OsdsText>

          <div className="flex mt-8 gap-4">
            <ButtonLink
              color="primary"
              variant="outline"
              to=".."
              actionName="cancel"
              actionValues={actionValues}
              slot="actions"
            >
              {tVolumeEdit(
                'pci_projects_project_storages_blocks_block_volume-edit_cancel_label',
              )}
            </ButtonLink>

            <Button
              color="primary"
              onClick={onEdit}
              actionName="confirm"
              actionValues={actionValues}
              disabled={!formState.name || hasError}
              slot="actions"
              data-testid="editPage-button_submit"
            >
              {tEdit(
                'pci_projects_project_storages_blocks_block_edit_submit_label',
              )}
            </Button>
          </div>
        </>
      )}
    </PCICommonContext.Provider>
  );
}
