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
import { TMicroRegionData } from '../../view-models/microRegionsViewModel';
import { useEffect } from 'react';

type TMicroRegionSelectionProps = {
  microRegions: TMicroRegionData[];
};

export const MicroRegionSelection = ({
  microRegions,
}: TMicroRegionSelectionProps) => {
  const { t } = useTranslation('creation');
  const { control, setValue } = useFormContext<TInstanceCreationForm>();
  const selectedMicroRegion = useWatch({ control, name: 'microRegion' });

  useEffect(() => {
    const availablePreviousMicroRegion = microRegions.find(
      (microRegion) => microRegion.value === selectedMicroRegion,
    );

    if (!availablePreviousMicroRegion && microRegions[0])
      setValue('microRegion', microRegions[0].value);
  }, [microRegions, selectedMicroRegion, setValue]);

  return (
    <Controller
      name="microRegion"
      control={control}
      render={({ field }) => {
        const handleMicroRegionChange = (
          microRegions: SelectValueChangeDetail,
        ) => field.onChange(microRegions.value[0]);

        return (
          <FormField>
            <FormFieldLabel>
              {t('pci_instance_creation_select_localization_label')}
            </FormFieldLabel>
            <Select
              items={microRegions}
              value={selectedMicroRegion ? [selectedMicroRegion] : []}
              onValueChange={handleMicroRegionChange}
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
