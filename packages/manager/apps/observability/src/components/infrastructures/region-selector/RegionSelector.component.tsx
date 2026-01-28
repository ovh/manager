import React, { useMemo, useState } from 'react';

import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  FormField,
  FormFieldHelper,
  SPINNER_SIZE,
  Spinner,
  Tab,
  TabList,
  Tabs,
  TabsValueChangeEvent,
} from '@ovhcloud/ods-react';

import { TEXT_PRESET, Text } from '@ovh-ux/muk';

import { RadioCard } from '@/components/form/radio-card/RadioCard.component';
import { RegionBadgeType } from '@/components/infrastructures/region-badge-type/RegionBadgeType.component';
import { useObservabilityServiceContext } from '@/contexts/ObservabilityService.context';
import { useInfrastructures } from '@/data/hooks/infrastructures/useInfrastructures.hook';
import { GroupedInfrastructures } from '@/types/infrastructures.type';
import { TenantFormData } from '@/types/tenants.type';
import { toParenthesesLabel } from '@/utils/form.utils';
import { ALL_ZONE } from '@/utils/infrastructures.constants';
import { getZones, groupByGeographicZone } from '@/utils/infrastructures.utils';

export default function RegionSelector() {
  const { t } = useTranslation('infrastructure');
  const {
    control,
    formState: { errors },
  } = useFormContext<TenantFormData>();
  const { selectedService } = useObservabilityServiceContext();

  const { data: infrastructures, isLoading } = useInfrastructures({
    resourceName: selectedService?.id || '',
    usages: 'METRICS',
    types: 'SHARED',
  });

  const groupedInfrastructures = useMemo(() => {
    return groupByGeographicZone(infrastructures);
  }, [infrastructures]);

  const zones = useMemo(() => {
    return getZones(groupedInfrastructures);
  }, [groupedInfrastructures]);

  const [selectedZone, setSelectedZone] = useState<keyof GroupedInfrastructures>(ALL_ZONE);

  if (isLoading) {
    return <Spinner size={SPINNER_SIZE.sm} />;
  }

  return (
    <>
      <Text preset={TEXT_PRESET.heading2}>{t('infrastructure.region.title')}</Text>
      <FormField className="my-4 block">
        <Controller
          name="infrastructureId"
          control={control}
          render={({ field }) => (
            <>
              <Tabs
                value={selectedZone}
                onValueChange={(value: TabsValueChangeEvent) => {
                  setSelectedZone(value?.value);
                }}
              >
                <TabList>
                  {zones.map((zone) => (
                    <Tab key={zone} value={zone}>
                      {t(`infrastructure.region.${zone}`)}
                    </Tab>
                  ))}
                </TabList>
              </Tabs>
              <div className="mb-9 mt-8 space-y-5">
                {groupedInfrastructures[selectedZone]?.map((infrastructure) => (
                  <RadioCard
                    id={infrastructure.id}
                    onChange={(event) => field.onChange(event.target.value)}
                    selected={field.value ?? ''}
                    key={infrastructure.id}
                    name="infrastructureId"
                    title={infrastructure.locationDetails.location}
                    subTitle={toParenthesesLabel(infrastructure.locationDetails.name)}
                    badges={<RegionBadgeType type={infrastructure.locationDetails.type} />}
                  />
                ))}
              </div>
              {errors?.infrastructureId && (
                <FormFieldHelper>
                  <Text preset={TEXT_PRESET.caption}>{errors.infrastructureId.message}</Text>
                </FormFieldHelper>
              )}
            </>
          )}
        />
      </FormField>
    </>
  );
}
