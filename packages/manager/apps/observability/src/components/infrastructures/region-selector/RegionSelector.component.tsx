import { useMemo, useState } from 'react';

import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { ODS_SPINNER_SIZE, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsFormField, OdsSpinner, OdsTab, OdsTabs, OdsText } from '@ovhcloud/ods-components/react';

import { RadioCard } from '@/components/form/radio-card/RadioCard.component';
import { RegionBadgeType } from '@/components/infrastructures/region-badge-type/RegionBadgeType.component';
import { useObservabilityServiceContext } from '@/contexts/ObservabilityService.context';
import { useInfrastructures } from '@/data/hooks/infrastructures/useInfrastructures.hook';
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
  const [activeZone, setActiveZone] = useState<string>(ALL_ZONE);

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
    return <OdsSpinner size={ODS_SPINNER_SIZE.sm} />;
  }

  return (
    <>
      <OdsText preset={ODS_TEXT_PRESET.heading4}>{t('infrastructure.region.title')}</OdsText>
      <OdsFormField className="block my-4">
        <Controller
          name="infrastructureId"
          control={control}
          render={({ field }) => (
            <>
              <OdsTabs
                onOdsTabsSelected={(event) => {
                  const selectedZone = (event.detail.target as HTMLElement).id;
                  setActiveZone(selectedZone);
                }}
              >
                {zones.map((zone) => (
                  <OdsTab key={zone} id={zone} isSelected={activeZone === zone}>
                    {t(`infrastructure.region.${zone}`)}
                  </OdsTab>
                ))}
              </OdsTabs>
              <div className="grid grid-cols-1 gap-4 mt-4 w-1/2">
                {groupedInfrastructures[activeZone]?.map(({ id, locationDetails }) => (
                  <RadioCard
                    id={id}
                    onChange={(event) => field.onChange(event.target.value)}
                    selected={field.value}
                    key={id}
                    name="infrastructureId"
                    title={locationDetails.location}
                    subTitle={toParenthesesLabel(locationDetails.name)}
                    badges={<RegionBadgeType type={locationDetails.type} />}
                  />
                ))}
              </div>
              {errors?.infrastructureId && (
                <OdsText preset={ODS_TEXT_PRESET.caption}>
                  {errors?.infrastructureId?.message}
                </OdsText>
              )}
            </>
          )}
        />
      </OdsFormField>
    </>
  );
}
