import { upperFirst } from 'lodash/fp';
import { useTranslation } from 'react-i18next';

import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_RADIO_BUTTON_SIZE, ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import {
  OsdsRadio,
  OsdsRadioButton,
  OsdsRadioGroup,
  OsdsText,
} from '@ovhcloud/ods-components/react';

import { TClusterPlanEnum } from '@/types';

const PlanFilter = ({
  selectedPlan,
  onSelectPlan,
}: {
  selectedPlan?: TClusterPlanEnum;
  onSelectPlan?: (plan: TClusterPlanEnum) => void;
}) => {
  const { t } = useTranslation(['region-selector', 'add']);

  const plans = [TClusterPlanEnum.ALL, TClusterPlanEnum.FREE, TClusterPlanEnum.STANDARD];

  return (
    <>
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        level={ODS_TEXT_LEVEL.body}
        size={ODS_TEXT_SIZE._600}
        slot="label"
        className="font-semibold"
      >
        {t('add:kubernetes_add_region_plan_select')}
      </OsdsText>

      <OsdsRadioGroup
        data-testid="radio-group"
        className="mt-2 flex gap-4"
        color={ODS_THEME_COLOR_INTENT.primary}
        value={selectedPlan}
        onOdsValueChange={(e) => {
          onSelectPlan?.(e.detail.newValue as TClusterPlanEnum);
        }}
      >
        {plans.map((plan) => {
          return (
            <OsdsRadio value={plan} key={plan}>
              <OsdsRadioButton
                className="cursor-pointer"
                color={ODS_THEME_COLOR_INTENT.primary}
                size={ODS_RADIO_BUTTON_SIZE.xs}
              >
                <OsdsText color={ODS_THEME_COLOR_INTENT.text} size={ODS_TEXT_SIZE._400} slot="end">
                  {plan === TClusterPlanEnum.ALL
                    ? upperFirst(t(`pci_projects_project_filter_by_plan_${plan}`))
                    : upperFirst(plan)}
                </OsdsText>
              </OsdsRadioButton>
            </OsdsRadio>
          );
        })}
      </OsdsRadioGroup>
    </>
  );
};

export default PlanFilter;
