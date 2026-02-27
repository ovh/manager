import { useEffect } from 'react';

import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  FormField,
  FormFieldLabel,
  Select,
  SelectContent,
  SelectControl,
  SelectValueChangeDetail,
  Text,
} from '@ovhcloud/ods-react';

import { useShareCatalog } from '@/data/hooks/catalog/useShareCatalog';
import { CreateShareFormValues } from '@/pages/create/schema/CreateShare.schema';
import { selectMicroRegions } from '@/pages/create/view-model/shareCatalog.view-model';

export const MicroRegionSelection = () => {
  const { t } = useTranslation(['create']);
  const { control, setValue } = useFormContext<CreateShareFormValues>();
  const [selectedMacroRegion, selectedMicroRegion] = useWatch({
    control,
    name: ['macroRegion', 'shareData.microRegion'],
  });

  const { data: microRegionOptions } = useShareCatalog({
    select: selectMicroRegions(selectedMacroRegion),
  });

  useEffect(() => {
    if (!microRegionOptions) return;

    const isSelectedMicroRegionInOptions = !!microRegionOptions.find(
      (microRegionOption) => microRegionOption.value === selectedMicroRegion,
    );

    if (!isSelectedMicroRegionInOptions && microRegionOptions.length > 1) {
      const firstEnabledMicroRegion = microRegionOptions.find((option) => !option.disabled);

      if (firstEnabledMicroRegion?.value) {
        setValue('shareData.microRegion', firstEnabledMicroRegion.value);
      }
    }
  }, [selectedMicroRegion, microRegionOptions, setValue]);

  return (
    <section>
      <Text preset="heading-4">{t('create:localisation.microRegion.title')}</Text>
      <div className="max-w-[32%]">
        <Controller
          name="shareData.microRegion"
          control={control}
          render={({ field }) => {
            const handleMicroRegionChange = (microRegions: SelectValueChangeDetail) =>
              field.onChange(microRegions.value[0]);

            return (
              <FormField>
                <FormFieldLabel>{t('create:localisation.microRegion.label')}</FormFieldLabel>
                <Select
                  items={microRegionOptions ?? []}
                  value={field.value ? [field.value] : []}
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
    </section>
  );
};
