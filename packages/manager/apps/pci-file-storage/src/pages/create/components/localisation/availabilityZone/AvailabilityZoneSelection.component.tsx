import { useEffect, useState } from 'react';

import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  Radio,
  RadioControl,
  RadioGroup,
  RadioLabel,
  RadioValueChangeDetail,
  Text,
} from '@ovhcloud/ods-react';

import { PciCard } from '@/components/new-lib/pciCard/PciCard.component';
import { useShareCatalog } from '@/data/hooks/catalog/useShareCatalog';
import { CreateShareFormValues } from '@/pages/create/schema/CreateShare.schema';
import { TAvailabilityZoneData } from '@/pages/create/view-model/shareCatalog.view-model';
import { selectAvailabilityZones } from '@/pages/create/view-model/shareCatalog.view-model';

type TAvailabilityZoneChoice = 'companyChoice' | 'userChoice';

export const AvailabilityZoneSelection = () => {
  const { t } = useTranslation(['create']);
  const { control, setValue } = useFormContext<CreateShareFormValues>();

  const [selectedMicroRegion, selectedAvailabilityZone] = useWatch({
    control,
    name: ['shareData.microRegion', 'availabilityZone'],
  });

  const { data: availabilityZones = [] } = useShareCatalog<TAvailabilityZoneData[]>({
    select: selectAvailabilityZones(selectedMicroRegion),
  });

  const [availabilityZoneChoice, setAvailabilityZoneChoice] =
    useState<TAvailabilityZoneChoice>('companyChoice');

  useEffect(() => {
    if (availabilityZones[0]) {
      setValue('availabilityZone', availabilityZones[0].value);
    }
  }, [availabilityZones, setValue, selectedMicroRegion]);

  const handleChoiceChange = (choice: RadioValueChangeDetail) => {
    const value = choice.value as TAvailabilityZoneChoice;
    if (value) setAvailabilityZoneChoice(choice.value as TAvailabilityZoneChoice);
    if (availabilityZones[0]?.value) setValue('availabilityZone', availabilityZones[0].value);
  };

  const handleAvailabilityZoneChange = (zone: TAvailabilityZoneData) => () => {
    if (zone) {
      setValue('availabilityZone', zone.value);
    }
  };

  useEffect(() => {
    return () => setValue('availabilityZone', null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section>
      <div className="flex flex-col gap-4">
        <div className="flex items-center space-x-4">
          <Text preset="heading-4">{t('create:localisation.availabilityZone.title')}</Text>
        </div>

        <Text preset="paragraph">{t('create:localisation.availabilityZone.informations')}</Text>
      </div>
      <RadioGroup
        name="availabilityZoneChoice"
        value={availabilityZoneChoice}
        onValueChange={handleChoiceChange}
        className="pt-6"
      >
        <Radio value="companyChoice">
          <RadioControl />
          <RadioLabel className="text-[--ods-color-text]">
            {t('create:localisation.availabilityZone.choice.company')}
          </RadioLabel>
        </Radio>
        <Radio value="userChoice">
          <RadioControl />
          <RadioLabel className="text-[--ods-color-text]">
            {t('create:localisation.availabilityZone.choice.user')}
          </RadioLabel>
        </Radio>
      </RadioGroup>
      {availabilityZoneChoice === 'userChoice' && (
        <Controller
          name="availabilityZone"
          control={control}
          render={() => (
            <RadioGroup value={selectedAvailabilityZone ?? ''} name="availabilityZone">
              <div className="flex gap-6 pt-6">
                {availabilityZones.map((zone) => (
                  <PciCard
                    compact
                    key={zone.value}
                    selectable
                    selected={selectedAvailabilityZone === zone.value}
                    onClick={handleAvailabilityZoneChange(zone)}
                  >
                    <PciCard.Header>
                      <Radio value={zone.value}>
                        <RadioControl />
                        <RadioLabel>
                          <Text>{zone.label}</Text>
                        </RadioLabel>
                      </Radio>
                    </PciCard.Header>
                  </PciCard>
                ))}
              </div>
            </RadioGroup>
          )}
        />
      )}
    </section>
  );
};
