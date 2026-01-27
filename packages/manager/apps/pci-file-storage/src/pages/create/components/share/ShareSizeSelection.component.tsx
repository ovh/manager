import { useEffect } from 'react';

import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { FormField, FormFieldLabel, Text } from '@ovhcloud/ods-react';

import { SliderInput } from '@/components/slider/SliderInput.component';
import { useShareCatalog } from '@/data/hooks/catalog/useShareCatalog';
import { CreateShareFormValues } from '@/pages/create/schema/CreateShare.schema';
import { selectShareSpecs } from '@/pages/create/view-model/shareCatalog.view-model';

const DEFAULT_MIN = 150;
const DEFAULT_MAX = 10240;

export const ShareSizeSelection = () => {
  const { t } = useTranslation(['create']);
  const { control, setValue } = useFormContext<CreateShareFormValues>();

  const [selectedMicroRegion, selectedSpecName, currentSize] = useWatch({
    control,
    name: ['shareData.microRegion', 'shareData.specName', 'shareData.size'],
  });

  const { data: shareOptions = [] } = useShareCatalog({
    select: selectShareSpecs(selectedMicroRegion),
  });

  const selectedSpec = shareOptions.find((spec) => spec.name === selectedSpecName);

  const min = selectedSpec?.capacityMin ?? DEFAULT_MIN;
  const max = selectedSpec?.capacityMax ?? DEFAULT_MAX;

  const handleChange = (value: number) => {
    setValue('shareData.size', value, { shouldValidate: true });
  };

  useEffect(() => {
    setValue('shareData.size', min);
  }, [min, setValue]);

  return (
    <section>
      <div className="flex flex-col gap-4">
        <Text preset="heading-4">{t('create:shareSize.title')}</Text>
        <Text preset="paragraph">{t('create:shareSize.description')}</Text>
      </div>
      <div className="pt-6">
        <FormField className="w-full">
          <FormFieldLabel>{t('create:shareSize.label')}</FormFieldLabel>
          <SliderInput
            value={currentSize}
            onChange={handleChange}
            min={min}
            max={max}
            inputName="shareSize"
          />
        </FormField>
      </div>
      <span>{currentSize}</span>
    </section>
  );
};
