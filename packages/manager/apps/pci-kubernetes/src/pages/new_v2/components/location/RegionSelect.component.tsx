import { useMemo } from 'react';

import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { RadioGroup } from '@ovhcloud/ods-react';

import { RegionCard } from '@/components/location/RegionCard.component';
import { TContinentCode } from '@/domain/entities/regions';
import { isCountryCode } from '@/helpers/location';

import { TCreateClusterSchema } from '../../CreateClusterForm.schema';

type TRegionSelectProps = {
  // TODO (TAPC-5549) : mock format, will be updated or removed
  regions: Array<{
    id: string;
    title: string;
    datacenter: string;
    country: string;
    continent: TContinentCode;
    microRegions: string[];
    plans: string[];
    disabled: boolean;
  }>;
};

export const RegionSelect = ({ regions }: TRegionSelectProps) => {
  const { t } = useTranslation('add');

  const { control, setValue } = useFormContext<TCreateClusterSchema>();
  const macroRegionField = useWatch({
    control,
    name: 'location.macroRegion',
  });

  const handleSelectMacroRegion = (macroRegionId: string | null) => {
    const macroRegion = regions.find(({ id }) => id === macroRegionId);
    const firstMicroRegion = macroRegion?.microRegions.at(0);

    if (!macroRegion || !firstMicroRegion) return;

    setValue('location.macroRegion', macroRegion.id);
    setValue('location.microRegion', firstMicroRegion);
  };

  const regionOptions = useMemo(
    () =>
      regions.map((region) => ({
        ...region,
        country: isCountryCode(region.country) ? region.country : null,
        datacenterDetails: region.microRegions.length > 1 ? region.id : region.microRegions.at(0),
        plans: region.plans.map((plan) =>
          plan === 'free' ? t('kube_add_plan_title_free') : t('kube_add_plan_title_standard'),
        ),
      })),
    [regions, t],
  );

  return (
    <Controller
      name="location.macroRegion"
      control={control}
      render={() => (
        <RadioGroup
          name="region"
          value={macroRegionField}
          onValueChange={({ value }) => handleSelectMacroRegion(value)}
          className="grid w-full grid-cols-2 gap-6 lg:grid-cols-3 xxl:grid-cols-4"
        >
          {regionOptions.map((region) => (
            <RegionCard
              key={region.id}
              city={region.title}
              regionId={region.id}
              datacenterDetails={region.datacenterDetails ?? ''}
              countryCode={region.country}
              labels={region.plans}
              disabled={region.disabled}
              onSelect={() => {
                handleSelectMacroRegion(region.id);
              }}
            />
          ))}
        </RadioGroup>
      )}
    />
  );
};
