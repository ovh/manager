import { useMemo } from 'react';

import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  FormField,
  FormFieldLabel,
  Select,
  SelectContent,
  SelectControl,
  SelectValueChangeDetail,
} from '@ovhcloud/ods-react';

import { TCreateClusterSchema } from '../../CreateClusterForm.schema';

// TODO (TAPC-5549) : Put this in a view model
const selectPlansMock = (): Array<{
  labelKey: string;
  plan: TCreateClusterSchema['plan'];
}> => {
  return [
    { labelKey: 'kubernetes_add_region_plan_all', plan: 'all' },
    { labelKey: 'kube_add_plan_title_standard', plan: 'standard' },
    { labelKey: 'kube_add_plan_title_free', plan: 'free' },
  ];
};

export const PlanSelect = () => {
  const { t } = useTranslation('add');

  const { control } = useFormContext<TCreateClusterSchema>();

  const planOptions = useMemo(() => {
    return selectPlansMock().map(({ plan, labelKey }) => ({
      value: plan,
      label: t(labelKey),
    }));
  }, [t]);

  return (
    <Controller
      name="plan"
      control={control}
      render={({ field, fieldState }) => {
        const handlePlanChange = (plans: SelectValueChangeDetail) => field.onChange(plans.value[0]);

        return (
          <FormField invalid={!!fieldState.error}>
            <FormFieldLabel>{t('kubernetes_add_region_plan_select')}</FormFieldLabel>
            <Select
              items={planOptions}
              value={field.value ? [field.value] : []}
              onValueChange={handlePlanChange}
            >
              <SelectControl />
              <SelectContent />
            </Select>
          </FormField>
        );
      }}
    />
  );
};
