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

import {
  TCreateClusterSchema,
  createClusterFormContinentCodes,
} from '../../CreateClusterForm.schema';

// TODO (TAPC-5549) : Put this in a view model
const selectContinentMock = (): Array<{
  labelKey: string;
  continentCode: TCreateClusterSchema['continent'];
}> => {
  return createClusterFormContinentCodes.map((code) => ({
    labelKey: `common_continent_label_${code}`,
    continentCode: code,
  }));
};

export const ContinentSelect = () => {
  const { t } = useTranslation(['common', 'add']);

  const { control } = useFormContext<TCreateClusterSchema>();

  const continentOptions = useMemo(() => {
    return selectContinentMock().map(({ continentCode, labelKey }) => ({
      value: continentCode,
      label: t(labelKey),
    }));
  }, [t]);

  return (
    <Controller
      name="continent"
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
