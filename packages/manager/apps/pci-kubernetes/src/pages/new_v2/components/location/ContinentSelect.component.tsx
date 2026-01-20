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
import { selectContinentOptions } from '../../view-models/location.viewmodel';

export const ContinentSelect = () => {
  const { t } = useTranslation(['common', 'add']);

  const { control } = useFormContext<TCreateClusterSchema>();

  const continentOptions = useMemo(() => {
    return selectContinentOptions().map(({ continentCode, labelKey }) => ({
      value: continentCode,
      label: t(labelKey),
    }));
  }, [t]);

  return (
    <Controller
      name="location.continent"
      control={control}
      render={({ field, fieldState }) => {
        const handleContinentChange = (continents: SelectValueChangeDetail) =>
          field.onChange(continents.value[0]);

        return (
          <FormField invalid={!!fieldState.error}>
            <FormFieldLabel>{t('add:kubernetes_add_region_continent_select')}</FormFieldLabel>
            <Select
              items={continentOptions}
              value={field.value ? [field.value] : []}
              onValueChange={handleContinentChange}
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
