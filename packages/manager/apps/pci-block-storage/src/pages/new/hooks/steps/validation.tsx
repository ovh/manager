import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OsdsButton, OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_SIZE, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { Translation, useTranslation } from 'react-i18next';
import {
  PciTrustedZoneBanner,
  TStep,
  useNotifications,
} from '@ovhcloud/manager-components';
import { ApiError } from '@ovh-ux/manager-core-api';
import { StepsEnum } from '@/pages/new/steps.enum';
import { PriceEstimate } from '@/pages/new/components/PriceEstimate';
import { useAddVolume } from '@/api/hooks/useVolume';
import { TFormState } from '@/pages/new/form.type';

export const useValidationStep = (
  projectId: string,
): TStep<StepsEnum, TFormState> => {
  const { t } = useTranslation('add');
  const { addSuccess, addError } = useNotifications();

  return {
    order: 5,
    title: (
      <OsdsText
        level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
        size={ODS_THEME_TYPOGRAPHY_SIZE._500}
        color={ODS_THEME_COLOR_INTENT.text}
      >
        {t('pci_projects_project_storages_blocks_add_submit_title')}
      </OsdsText>
    ),
    Content: ({ stepperState }: { stepperState: TFormState }) => {
      const navigate = useNavigate();
      const { addVolume, isPending } = useAddVolume({
        projectId,
        name: stepperState.volumeName,
        regionName: stepperState.region?.name,
        volumeCapacity: stepperState.volumeCapacity,
        volumeType: stepperState.volumeType?.blobs.technical.name,
        onSuccess: () => {
          navigate('..');
          addSuccess(
            <Translation ns="add">
              {(tr) =>
                tr('pci_projects_project_storages_blocks_add_success_message', {
                  volume: stepperState.volumeName,
                })
              }
            </Translation>,
            true,
          );
        },
        onError: (err: ApiError) => {
          navigate('..');
          addError(
            <Translation ns="add">
              {(tr) =>
                tr('pci_projects_project_storages_blocks_add_error_post', {
                  volume: stepperState.volumeName,
                  message: err?.response?.data?.message || err?.message || null,
                })
              }
            </Translation>,
            true,
          );
        },
      });
      return (
        <div className="mb-6">
          <PriceEstimate
            volumeCapacity={stepperState.volumeCapacity}
            volumeType={stepperState.volumeType}
          />

          <div className="my-5">
            <PciTrustedZoneBanner />
          </div>
          <div className="flex flex-row">
            <OsdsButton
              className="mt-4 mr-4 w-fit"
              size={ODS_BUTTON_SIZE.md}
              color={ODS_THEME_COLOR_INTENT.primary}
              {...(isPending ? { disabled: true } : {})}
              onClick={() => {
                if (!isPending) {
                  addVolume();
                }
              }}
            >
              {t('pci_projects_project_storages_blocks_add_submit_label')}
            </OsdsButton>
            <OsdsButton
              className="mt-4 w-fit"
              size={ODS_BUTTON_SIZE.md}
              color={ODS_THEME_COLOR_INTENT.primary}
              variant={ODS_BUTTON_VARIANT.ghost}
              {...(isPending ? { disabled: true } : {})}
              onClick={() => {
                navigate('..');
              }}
            >
              {t(
                'pci_projects_project_storages_blocks_add_submit_cancel_label',
              )}
            </OsdsButton>
          </div>
        </div>
      );
    },
  };
};
