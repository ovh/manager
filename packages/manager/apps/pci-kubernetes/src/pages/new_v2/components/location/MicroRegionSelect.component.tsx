import { type FC, useMemo } from 'react';

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

import { TCreateClusterSchema } from '../../CreateClusterForm.schema';

type TMicroRegionSelectProps = {
  regions: Array<string>;
};

export const MicroRegionSelect: FC<TMicroRegionSelectProps> = ({ regions }) => {
  const { t } = useTranslation('add');

  const { control } = useFormContext<TCreateClusterSchema>();
  const microRegionField = useWatch({
    control,
    name: 'location.microRegion',
  });

  const regionOptions = useMemo(() => {
    return regions.map((region) => ({
      value: region,
      label: region,
    }));
  }, [regions]);

  return (
    <div className="flex flex-col gap-4 pb-5 pt-9">
      <Text preset="heading-4">{t('kubernetes_add_micro_region_choose')}</Text>
      <div className="sm:w-1/2">
        <Controller
          name="location.microRegion"
          control={control}
          render={({ field }) => {
            const handleMicroRegionChange = (microRegions: SelectValueChangeDetail) =>
              field.onChange(microRegions.value[0]);

            return (
              <FormField>
                <FormFieldLabel>{t('kubernetes_add_micro_region_select')}</FormFieldLabel>
                <Select
                  items={regionOptions}
                  value={microRegionField ? [microRegionField] : []}
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
