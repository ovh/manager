import {
  OsdsButton,
  OsdsFormField,
  OsdsInput,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { TAct, TIs, TStep } from '@ovhcloud/manager-components';
import { ODS_BUTTON_SIZE, ODS_INPUT_TYPE } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import React from 'react';
import { StepsEnum } from '@/pages/new/steps.enum';
import { TFormState } from '@/pages/new/form.type';
import style from '@/components/common.module.css';

export const useNameStep = (): TStep<StepsEnum, TFormState> => {
  const { t } = useTranslation('add');
  const { t: tStepper } = useTranslation('stepper');

  return {
    order: 4,
    title: ({ act, stepIs }: { act: TAct<StepsEnum>; stepIs: TIs }) => (
      <>
        <OsdsText
          level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
          size={ODS_THEME_TYPOGRAPHY_SIZE._500}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {t('pci_projects_project_storages_blocks_add_name_title')}
        </OsdsText>
        {stepIs.locked && (
          <span className={style.linkContainer}>
            <a
              onClick={() => {
                act.unlock(StepsEnum.VOLUME_NAME_STEP);
                [StepsEnum.VALIDATION_STEP].forEach((step) => {
                  act.uncheck(step);
                  act.unlock(step);
                  act.close(step);
                });
              }}
              className="mx-3 float-right"
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
    }) => (
      <div>
        <OsdsFormField error={''}>
          <OsdsText color={ODS_THEME_COLOR_INTENT.text} slot="label">
            {t('pci_projects_project_storages_blocks_add_name_title')}
          </OsdsText>
          <OsdsInput
            type={ODS_INPUT_TYPE.text}
            defaultValue={stepperState.volumeName}
            value={stepperState.volumeName}
            color={ODS_THEME_COLOR_INTENT.primary}
            error={false}
            onOdsValueChange={(event) => {
              setStepperState((prev) => ({
                ...prev,
                volumeName: `${event.target.value}`,
              }));
            }}
          />
        </OsdsFormField>
        <div className="mt-6">
          {!stepIs.locked && (
            <OsdsButton
              className="w-fit"
              size={ODS_BUTTON_SIZE.md}
              color={ODS_THEME_COLOR_INTENT.primary}
              {...(!stepperState.volumeName ? { disabled: true } : {})}
              onClick={() => {
                if (stepperState.volumeName) {
                  act.check(StepsEnum.VOLUME_NAME_STEP);
                  act.lock(StepsEnum.VOLUME_NAME_STEP);
                  act.open(StepsEnum.VALIDATION_STEP);
                }
              }}
            >
              {tStepper('common_stepper_next_button_label')}
            </OsdsButton>
          )}
        </div>
      </div>
    ),
  };
};
