import {
  OsdsButton,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  TAct,
  TIs,
  TilesInputComponent,
  TStep,
  useCatalogPrice,
} from '@ovhcloud/manager-components';
import { ODS_BUTTON_SIZE, ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import React from 'react';
import { useConsumptionVolumesAddon } from '@/api/hooks/useConsumptionVolumesAddon';
import { TCatalog } from '@/api/data/catalog';
import { StepsEnum } from '@/pages/new/steps.enum';
import { useTranslateBytes } from '@/pages/new/hooks/useTranslateBytes';
import { TFormState } from '@/pages/new/form.type';
import style from '@/components/common.module.css';

export const useTypeStep = (
  projectId: string,
): TStep<StepsEnum, TFormState> => {
  const { t } = useTranslation('add');
  const { t: tStepper } = useTranslation('stepper');
  const tBytes = useTranslateBytes();
  const { getFormattedCatalogPrice } = useCatalogPrice(6);

  return {
    order: 2,
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
          {t('pci_projects_project_storages_blocks_add_type_title')}
        </OsdsText>
        {stepIs.locked && (
          <span className={style.linkContainer}>
            <a
              color={ODS_THEME_COLOR_INTENT.primary}
              onClick={() => {
                act.unlock(StepsEnum.VOLUME_TYPE_STEP);
                [
                  StepsEnum.VOLUME_CAPACITY_STEP,
                  StepsEnum.VOLUME_NAME_STEP,
                  StepsEnum.VALIDATION_STEP,
                ].forEach((step) => {
                  act.uncheck(step);
                  act.unlock(step);
                  act.close(step);
                });
                setStepperState((prev) => ({ ...prev, volumeType: undefined }));
              }}
              className="mx-3 float-right"
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
      const { volumeTypes, isPending } = useConsumptionVolumesAddon(
        projectId,
        stepperState.region,
      );

      const displayedTypes =
        stepperState.volumeType && stepIs.locked
          ? [stepperState.volumeType]
          : volumeTypes;

      if (isPending) {
        return <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />;
      }

      return (
        <>
          <TilesInputComponent<TCatalog['addons'][0]>
            value={stepperState.volumeType}
            items={displayedTypes || []}
            label={(vType: TCatalog['addons'][0]) => (
              <div className="w-full">
                <div className="border-solid border-0 border-b border-b-[#85d9fd] py-3">
                  <OsdsText
                    level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                    size={ODS_THEME_TYPOGRAPHY_SIZE._600}
                    color={ODS_THEME_COLOR_INTENT.text}
                  >
                    {vType.blobs.technical.name}
                  </OsdsText>
                </div>
                <div className="py-3">
                  <OsdsText
                    level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                    color={ODS_THEME_COLOR_INTENT.text}
                  >
                    {vType.blobs.technical.volume.iops.guaranteed
                      ? t(
                          'pci_projects_project_storages_blocks_add_type_addon_iops_guaranteed',
                          {
                            iops: vType.blobs.technical.volume.iops.level,
                            separator: ', ',
                          },
                        )
                      : t(
                          'pci_projects_project_storages_blocks_add_type_addon_iops_not_guaranteed',
                          {
                            iops:
                              vType.blobs.technical.volume.iops.max ||
                              vType.blobs.technical.volume.iops.level,
                            separator: ', ',
                          },
                        )}
                    {t(
                      'pci_projects_project_storages_blocks_add_type_addon_capacity_max',
                      {
                        capacity: tBytes(
                          vType.blobs.technical.volume.capacity.max,
                          0,
                          false,
                          'GB',
                          false,
                        ),
                      },
                    )}{' '}
                    <br />
                    {t(
                      'pci_projects_project_storages_blocks_add_type_addon_price',
                      {
                        price: getFormattedCatalogPrice(
                          vType.pricings[0]?.price,
                        ),
                      },
                    )}
                  </OsdsText>
                </div>
              </div>
            )}
            onInput={(vType) => {
              setStepperState((prev) => ({ ...prev, volumeType: vType }));
            }}
          />
          {stepperState.volumeType && !stepIs.locked && (
            <div className="mt-6">
              <OsdsButton
                size={ODS_BUTTON_SIZE.md}
                color={ODS_THEME_COLOR_INTENT.primary}
                onClick={() => {
                  act.check(StepsEnum.VOLUME_TYPE_STEP);
                  act.lock(StepsEnum.VOLUME_TYPE_STEP);

                  act.open(StepsEnum.VOLUME_CAPACITY_STEP);
                }}
                className="w-fit"
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
