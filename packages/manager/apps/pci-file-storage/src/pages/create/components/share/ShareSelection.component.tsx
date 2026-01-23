import { useEffect } from 'react';

import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Radio, RadioControl, RadioGroup, RadioLabel, Text } from '@ovhcloud/ods-react';

import { TShareSpecData } from '@/adapters/catalog/left/shareCatalog.data';
import { PciCard } from '@/components/new-lib/pciCard/PciCard.component';
import { useShareCatalog } from '@/data/hooks/catalog/useShareCatalog';
import { CreateShareFormValues } from '@/pages/create/schema/CreateShare.schema';
import { selectShareSpecs } from '@/pages/create/view-model/shareCatalog.view-model';

export const ShareSelection = () => {
  const { t } = useTranslation(['create']);
  const { control, setValue } = useFormContext<CreateShareFormValues>();

  const [selectedMicroRegion, selectedSpecName] = useWatch({
    control,
    name: ['shareData.microRegion', 'shareData.specName'],
  });

  const { data: shareOptions = [] } = useShareCatalog<TShareSpecData[]>({
    select: selectShareSpecs(selectedMicroRegion),
  });

  useEffect(() => {
    if (shareOptions[0]) {
      setValue('shareData.specName', shareOptions[0].name);
    }
  }, [shareOptions, setValue]);

  const handleShareSpecChange = (spec: TShareSpecData) => () => {
    setValue('shareData.specName', spec.name);
  };

  return (
    <section>
      <div className="flex flex-col gap-4">
        <Text preset="heading-4">{t('create:share.title')}</Text>
      </div>
      <Controller
        name="shareData.specName"
        control={control}
        render={() => (
          <RadioGroup value={selectedSpecName ?? ''} name="shareData.specName" className="pt-6">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
              {shareOptions.map((spec) => (
                <PciCard
                  key={spec.name}
                  selectable
                  selected={selectedSpecName === spec.name}
                  onClick={handleShareSpecChange(spec)}
                  className="h-full"
                >
                  <PciCard.Header>
                    <Radio value={spec.name}>
                      <RadioControl />
                      <RadioLabel className="text-lg font-bold text-[--ods-color-heading]">
                        {spec.name}
                      </RadioLabel>
                    </Radio>
                  </PciCard.Header>
                  <PciCard.Content>
                    <Text preset="paragraph" className="text-sm">
                      {t('create:share.description', {
                        capacityMin: spec.capacityMin,
                        iopsLevel: spec.iopsLevel,
                        bandwidthLevel: spec.bandwidthLevel,
                        bandwidthUnit: spec.bandwidthUnit,
                      })}
                    </Text>
                  </PciCard.Content>
                </PciCard>
              ))}
            </div>
          </RadioGroup>
        )}
      />
    </section>
  );
};
