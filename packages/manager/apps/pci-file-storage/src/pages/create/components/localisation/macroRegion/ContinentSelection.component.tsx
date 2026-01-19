import { useEffect, useMemo } from 'react';

import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  FormField,
  FormFieldLabel,
  Select,
  SelectContent,
  SelectControl,
  SelectValueChangeDetail,
} from '@ovhcloud/ods-react';

import { useShareCatalog } from '@/data/hooks/catalog/useShareCatalog';
import { CreateShareFormValues } from '@/pages/create/schema/CreateShare.schema';
import { selectContinent } from '@/pages/create/view-model/shareCatalog.view-model';

export const ContinentSelection = () => {
  const { t } = useTranslation(['create']);
  const { control, setValue } = useFormContext<CreateShareFormValues>();
  const [deploymentModes, selectedContinent] = useWatch({
    control,
    name: ['deploymentModes', 'continent'],
  });

  const { data: continentOptions = [] } = useShareCatalog({
    select: selectContinent(deploymentModes),
  });

  const translatedContinents = useMemo(
    () =>
      continentOptions.map((option) => ({
        label: t(`create:${option.labelKey}`),
        value: option.value,
      })),
    [continentOptions, t],
  );

  useEffect(() => {
    const availablePreviousSelectedContinent = continentOptions.find(
      (continentOption) => continentOption.value === selectedContinent,
    );

    if (!availablePreviousSelectedContinent && continentOptions[0]?.value) {
      setValue('continent', continentOptions[0].value);
    }
  }, [selectedContinent, continentOptions, setValue]);

  return (
    <Controller
      name="continent"
      control={control}
      render={({ field }) => {
        const handleContinentChange = (continents: SelectValueChangeDetail) =>
          field.onChange(continents.value[0]);

        return (
          <FormField className="w-[32%]">
            <FormFieldLabel>{t('create:localisation.continents.label')}</FormFieldLabel>
            <Select
              items={translatedContinents}
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
