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
import { TInstanceCreationForm } from '../../CreateInstance.page';
import { deps } from '@/deps/deps';
import { selectContinent } from '../../view-models/continentsViewModel';
import { useEffect } from 'react';
import { useProjectId } from '@/hooks/project/useProjectId';

export const ContinentSelection = () => {
  const projectId = useProjectId();
  const { t } = useTranslation('creation');
  const { control, setValue } = useFormContext<TInstanceCreationForm>();
  const [deploymentModes, continent] = useWatch({
    control,
    name: ['deploymentModes', 'continent'],
  });

  const continentOptions = selectContinent(deps)(projectId, deploymentModes);

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
          <FormField>
            <FormFieldLabel>
              {t('pci_instance_creation_select_localization_label')}
            </FormFieldLabel>
            <Select
              items={continentOptions}
              value={[field.value]}
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
