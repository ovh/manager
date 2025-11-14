import React, { useMemo } from 'react';

import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  FormField,
  FormFieldHelper,
  SPINNER_SIZE,
  Spinner,
  TEXT_PRESET,
  TabsComponent,
  Text,
} from '@ovh-ux/muk';

import { RadioCard } from '@/components/form/radio-card/RadioCard.component';
import { RegionBadgeType } from '@/components/infrastructures/region-badge-type/RegionBadgeType.component';
import '@/components/infrastructures/region-selector/RegionSelector.css';
import { useObservabilityServiceContext } from '@/contexts/ObservabilityService.context';
import { useInfrastructures } from '@/data/hooks/infrastructures/useInfrastructures.hook';
import { TenantFormData } from '@/types/tenants.type';
import { toParenthesesLabel } from '@/utils/form.utils';
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

  if (isLoading) {
    return <Spinner size={SPINNER_SIZE.sm} />;
  }

  return (
    <>
      <Text preset={TEXT_PRESET.heading4}>{t('infrastructure.region.title')}</Text>
      <FormField className="block my-4">
        <Controller
          name="infrastructureId"
          control={control}
          render={({ field }) => (
            <>
              <div className="region-selector-tabs">
                <TabsComponent
                  items={zones}
                  titleElement={({ item }: { item: string }) => (
                    <>{t(`infrastructure.region.${item}`)}</>
                  )}
                  contentElement={({ item }: { item: string }) => (
                    <div className="space-y-4 mt-4">
                      {groupedInfrastructures[item]?.map((infrastructure) => (
                        <RadioCard
                          id={infrastructure.id}
                          onChange={(event) => field.onChange(event.target.value)}
                          selected={field.value}
                          key={infrastructure.id}
                          name="infrastructureId"
                          title={infrastructure.locationDetails.location}
                          subTitle={toParenthesesLabel(infrastructure.locationDetails.name)}
                          badges={<RegionBadgeType type={infrastructure.locationDetails.type} />}
                        />
                      ))}
                    </div>
                  )}
                />
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
