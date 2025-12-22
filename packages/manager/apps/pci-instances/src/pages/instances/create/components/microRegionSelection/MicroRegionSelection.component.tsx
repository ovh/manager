import {
  FormField,
  FormFieldLabel,
  Select,
  SelectControl,
  SelectContent,
  SelectValueChangeDetail,
  Text,
} from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { TMicroRegionData } from '../../view-models/microRegionsViewModel';
import { useEffect } from 'react';
import { TInstanceCreationForm } from '../../CreateInstance.schema';

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
    <div className=" flex flex-col gap-4 pb-5 pt-9">
      <Text preset="heading-4">
        {t('creation:pci_instance_creation_select_datacenter_label')}
      </Text>
      <div className="max-w-[32%]">
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
                  {t('pci_instance_creation_choose_datacenter_label')}
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
      </div>
    </div>
  );
};
