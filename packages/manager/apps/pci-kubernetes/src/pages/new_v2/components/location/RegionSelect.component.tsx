import { useEffect, useMemo } from 'react';

import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { RadioGroup } from '@ovhcloud/ods-react';

import { RegionCard } from '@/components/location/RegionCard.component';
import { isCountryCode } from '@/helpers/location';

import { TCreateClusterSchema } from '../../CreateClusterForm.schema';

const MOCK_regions = [
  {
    id: 'GRA-A',
    title: 'Gravelines',
    datacenter: 'GRA',
    country: 'fr',
    microRegions: ['GRA9', 'GRA11'],
    plans: ['free', 'standard'],
    disabled: true,
  },
  {
    id: 'GRA-B',
    title: 'Gravelines',
    datacenter: 'GRA',
    country: 'fr',
    microRegions: ['GRA9', 'GRA11'],
    plans: ['free', 'standard'],
    disabled: false,
  },
  {
    id: 'GRA-C',
    title: 'Gravelines',
    datacenter: 'GRA',
    country: 'fr',
    microRegions: ['GRA9', 'GRA11'],
    plans: [],
    disabled: true,
  },
  {
    id: 'GRA-D',
    title: 'Gravelines',
    datacenter: 'GRA',
    country: 'fr',
    microRegions: ['GRA9', 'GRA11'],
    plans: ['standard'],
    disabled: false,
  },
  {
    id: 'GRA-E',
    title: 'Gravelines',
    datacenter: 'GRA',
    country: 'fr',
    microRegions: ['GRA9', 'GRA11'],
    plans: ['free'],
    disabled: false,
  },
  {
    id: 'GRA-F',
    title: 'Gravelines',
    datacenter: 'GRA',
    country: 'fr',
    microRegions: ['GRA9', 'GRA11'],
    plans: ['free', 'standard'],
    disabled: false,
  },
  {
    id: 'GRA-G',
    title: 'Gravelines',
    datacenter: 'GRA',
    country: 'fr',
    microRegions: ['GRA9', 'GRA11'],
    plans: ['free', 'standard'],
    disabled: false,
  },
  {
    id: 'GRA-H',
    title: 'Gravelines',
    datacenter: 'GRA',
    country: 'fr',
    microRegions: ['GRA9', 'GRA11'],
    plans: ['free', 'standard'],
    disabled: false,
  },
  {
    id: 'UK',
    title: 'Londres',
    datacenter: 'UK',
    country: 'uk',
    microRegions: ['UK1'],
    plans: ['free', 'standard'],
    disabled: false,
  },
  {
    id: 'GRA-J',
    title: 'Gravelines',
    datacenter: 'GRA',
    country: 'fr',
    microRegions: ['GRA9', 'GRA11'],
    plans: ['free', 'standard'],
    disabled: false,
  },
];

export const RegionSelect = () => {
  const { t } = useTranslation('add');

  const [macroRegionField, microRegionField] = useWatch<TCreateClusterSchema>({
    name: ['macroRegion', 'microRegion'],
  });
  const { control, setValue } = useFormContext<TCreateClusterSchema>();

  const handleSelectMacroRegion = (macroRegionId: string | null) => {
    const macroRegion = MOCK_regions.find(({ id }) => id === macroRegionId);
    const firstMicroRegion = macroRegion?.microRegions.at(0);

    if (!macroRegion || !firstMicroRegion) return;

    setValue('macroRegion', macroRegion.id);
    setValue('microRegion', firstMicroRegion);
  };

  // Default Value Handler
  useEffect(() => {
    const firstMacroRegion = MOCK_regions.find((region) => !region.disabled);
    const firstMicroRegion = firstMacroRegion?.microRegions.at(0);
    if (macroRegionField || microRegionField || !firstMacroRegion || !firstMicroRegion) return;

    setValue('macroRegion', firstMacroRegion.id);
    setValue('microRegion', firstMicroRegion);
  }, [macroRegionField, microRegionField, setValue]);

  const regionOptions = useMemo(
    () =>
      MOCK_regions.map((region) => ({
        ...region,
        country: isCountryCode(region.country) ? region.country : null,
        datacenterDetails: region.microRegions.length > 1 ? region.id : region.microRegions.at(0),
        plans: region.plans.map((plan) =>
          plan === 'free' ? t('kube_add_plan_title_free') : t('kube_add_plan_title_standard'),
        ),
      })),
    [t],
  );

  return (
    <Controller
      name="macroRegion"
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
