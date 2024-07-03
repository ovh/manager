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
import { TAct, TIs, TStep } from '@ovhcloud/manager-components';
import React, { useEffect, useState } from 'react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_INPUT_TYPE,
  ODS_SPINNER_SIZE,
} from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { StepsEnum } from '@/pages/new/steps.enum';
import { useRegionsQuota } from '@/api/hooks/useQuota';
import { PriceEstimate } from '@/pages/new/components/PriceEstimate';
import { HighSpeedV2Infos } from '@/pages/new/components/HighSpeedV2Infos';
import { TFormState } from '@/pages/new/form.type';
import style from '@/components/common.module.css';

export const VOLUME_MAX_SIZE = 4 * 1000; // Should be 10 * 1024 (but API is wrong;
export const VOLUME_MIN_SIZE = 10; // 10 Gio
export const VOLUME_UNLIMITED_QUOTA = -1; // Should be 10 * 1024 (but API is wrong)

export const useCapacityStep = (
  projectId: string,
): TStep<StepsEnum, TFormState> => {
  const { t } = useTranslation('add');
  const { t: tStepper } = useTranslation('stepper');

  return {
    order: 3,
    title: ({ act, stepIs }: { act: TAct<StepsEnum>; stepIs: TIs }) => (
      <>
        <OsdsText
          level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
          size={ODS_THEME_TYPOGRAPHY_SIZE._500}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {t('pci_projects_project_storages_blocks_add_size_title')}
        </OsdsText>

        {stepIs.locked && (
          <span className={style.linkContainer}>
            <a
              className="mx-3 float-right"
              color={ODS_THEME_COLOR_INTENT.primary}
              onClick={() => {
                act.unlock(StepsEnum.VOLUME_CAPACITY_STEP);
                [StepsEnum.VOLUME_NAME_STEP, StepsEnum.VALIDATION_STEP].forEach(
                  (step) => {
                    act.uncheck(step);
                    act.unlock(step);
                    act.close(step);
                  },
                );
              }}
            >
              {tStepper('common_stepper_modify_this_step')}
            </a>
          </span>
        )}
      </>
    ),
    content: ({
      act,
      stepIs,
      stepperState,
      setStepperState,
    }: {
      act: TAct<StepsEnum>;
      stepIs: TIs;
      stepperState: TFormState;
      setStepperState: React.Dispatch<React.SetStateAction<TFormState>>;
    }) => {
      const [maxSize, setMaxSize] = useState(0);
      // const { form, setForm } = useNewBlockStorageStore();
      const { data: regionQuotas, isLoading } = useRegionsQuota(projectId);

      useEffect(() => {
        if (!isLoading) {
          const quota = regionQuotas?.find(
            ({ region }) => region === stepperState.region?.name,
          );
          let availableGigabytes = VOLUME_MAX_SIZE;
          if (
            quota?.volume &&
            quota.volume.maxGigabytes !== VOLUME_UNLIMITED_QUOTA
          ) {
            availableGigabytes = Math.min(
              VOLUME_MAX_SIZE,
              quota.volume.maxGigabytes - quota.volume.usedGigabytes,
            );
          }
          setMaxSize(availableGigabytes);
          if (stepperState.volumeCapacity > availableGigabytes) {
            setStepperState((prev) => ({
              ...prev,
              volumeCapacity: availableGigabytes,
            }));
          }
        }
      }, [isLoading]);

      if (isLoading) {
        return <OsdsSpinner inline={true} size={ODS_SPINNER_SIZE.md} />;
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
                value={stepperState.volumeCapacity}
                color={ODS_THEME_COLOR_INTENT.primary}
                onOdsValueChange={(event) => {
                  setStepperState((prev) => ({
                    ...prev,
                    volumeCapacity: Number(event.detail.value),
                  }));
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
          <HighSpeedV2Infos
            volumeCapacity={stepperState.volumeCapacity}
            volumeType={stepperState.volumeType}
          />
          <PriceEstimate
            volumeCapacity={stepperState.volumeCapacity}
            volumeType={stepperState.volumeType}
          />
          <div className="my-6">
            <OsdsText
              level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
              size={ODS_THEME_TYPOGRAPHY_SIZE._200}
              color={ODS_THEME_COLOR_INTENT.text}
            >
              {t('pci_projects_project_storages_blocks_add_size_help')}
            </OsdsText>
          </div>
          {stepperState.volumeCapacity && !stepIs.locked && (
            <div>
              <OsdsButton
                className="w-fit"
                size={ODS_BUTTON_SIZE.md}
                color={ODS_THEME_COLOR_INTENT.primary}
                onClick={() => {
                  act.check(StepsEnum.VOLUME_CAPACITY_STEP);
                  act.lock(StepsEnum.VOLUME_CAPACITY_STEP);
                  act.open(StepsEnum.VOLUME_NAME_STEP);
                }}
              >
                {tStepper('common_stepper_next_button_label')}
              </OsdsButton>
            </div>
          )}
        </>
      );
    },
  };
};
