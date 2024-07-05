import { OsdsButton, OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_SIZE } from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  TAct,
  TIs,
  TStep,
  isDiscoveryProject,
  useProject,
} from '@ovhcloud/manager-components';
import { useTranslation } from 'react-i18next';
import React from 'react';
import { StepsEnum } from '@/pages/new/steps.enum';
import { RegionSelector } from '@/components/region-selector/RegionSelector.component';
import { RegionSummary } from '@/components/region-selector/RegionSummary.component';
import { TFormState } from '@/pages/new/form.type';
import style from '@/components/common.module.css';

export const useLocationStep = (
  projectId: string,
): TStep<StepsEnum, TFormState> => {
  const { t } = useTranslation('add');
  const { t: tStepper } = useTranslation('stepper');
  const { data: project } = useProject(projectId || '');
  const isDiscovery = isDiscoveryProject(project);

  return {
    order: 1,
    is: {
      open: true,
      locked: isDiscovery,
    },
    title: ({
      act,
      stepIs,
      setStepperState,
    }: {
      act: TAct<StepsEnum>;
      stepIs: TIs;
      setStepperState: React.Dispatch<React.SetStateAction<TFormState>>;
    }) => (
      <>
        <OsdsText
          level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
          size={ODS_THEME_TYPOGRAPHY_SIZE._500}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {t('pci_projects_project_storages_blocks_add_region_title')}
        </OsdsText>
        {stepIs.locked && !isDiscovery && (
          <span className={style.linkContainer}>
            <a
              className="mx-3 float-right"
              onClick={() => {
                act.unlock(StepsEnum.LOCATION_STEP);
                [
                  StepsEnum.VOLUME_TYPE_STEP,
                  StepsEnum.VOLUME_CAPACITY_STEP,
                  StepsEnum.VOLUME_NAME_STEP,
                  StepsEnum.VALIDATION_STEP,
                ].forEach((step) => {
                  act.uncheck(step);
                  act.unlock(step);
                  act.close(step);
                });
                setStepperState((prev) => ({ ...prev, volumeType: undefined }));
                return false;
              }}
            >
              {tStepper('common_stepper_modify_this_step')}
            </a>
          </span>
        )}
      </>
    ),
    Content: ({
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
      const hasRegion = !!stepperState.region;
      return (
        <>
          {hasRegion && stepIs.locked && (
            <RegionSummary region={stepperState.region} />
          )}
          {(!stepIs.locked || isDiscovery) && (
            <RegionSelector
              projectId={projectId}
              onSelectRegion={(region) => {
                setStepperState((prev) => ({ ...prev, region }));
              }}
              regionFilter={(r) =>
                r.isMacro ||
                r.services.some((s) => s.name === 'volume' && s.status === 'UP')
              }
            />
          )}
          {hasRegion && !stepIs.locked && (
            <OsdsButton
              className="mt-4 w-fit"
              size={ODS_BUTTON_SIZE.md}
              color={ODS_THEME_COLOR_INTENT.primary}
              onClick={() => {
                act.check(StepsEnum.LOCATION_STEP);
                act.lock(StepsEnum.LOCATION_STEP);
                act.open(StepsEnum.VOLUME_TYPE_STEP);
              }}
            >
              {tStepper('common_stepper_next_button_label')}
            </OsdsButton>
          )}
        </>
      );
    },
  };
};
