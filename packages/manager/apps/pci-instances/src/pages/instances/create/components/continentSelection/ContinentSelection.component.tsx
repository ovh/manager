import {
  FormField,
  FormFieldLabel,
  Select,
  SelectControl,
  SelectContent,
  SelectValueChangeDetail,
} from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { deps } from '@/deps/deps';
import { selectContinent } from '../../view-models/continentsViewModel';
import { useEffect, useMemo } from 'react';
import { useProjectId } from '@/hooks/project/useProjectId';
import { TInstanceCreationForm } from '../../CreateInstance.schema';

export const ContinentSelection = () => {
  const projectId = useProjectId();
  const { t } = useTranslation(['common', 'creation']);
  const { control, setValue } = useFormContext<TInstanceCreationForm>();
  const [deploymentModes, continent] = useWatch({
    control,
    name: ['deploymentModes', 'continent'],
  });

  const continentOptions = useMemo(
    () =>
      selectContinent(deps)(projectId, deploymentModes).map((option) => ({
        label: t(`common:${option.labelKey}`),
        value: option.value,
      })),
    [deploymentModes, projectId, t],
  );

  useEffect(() => {
    const availablePreviousSelectedContinent = continentOptions.find(
      (continentOption) => continentOption.value === continent,
    );

    if (!availablePreviousSelectedContinent && continentOptions[0]?.value) {
      setValue('continent', continentOptions[0].value);
    }
  }, [continent, continentOptions, setValue]);

  return (
    <Controller
      name="continent"
      control={control}
      render={({ field }) => {
        const handleContinentChange = (continents: SelectValueChangeDetail) =>
          field.onChange(continents.value[0]);

        return (
          <FormField className="w-[32%]">
            <FormFieldLabel>
              {t('creation:pci_instance_creation_select_continent_label')}
            </FormFieldLabel>
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
