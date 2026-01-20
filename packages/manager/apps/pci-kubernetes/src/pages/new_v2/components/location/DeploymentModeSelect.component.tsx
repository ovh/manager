import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Medium, Radio, RadioControl, RadioGroup, RadioLabel, Text } from '@ovhcloud/ods-react';

import { PciCard } from '@/components/pciCard/PciCard.component';
import { TDeploymentMode } from '@/domain/entities/regions';

import { TCreateClusterSchema } from '../../CreateClusterForm.schema';
import Logo1AZ from '/assets/1AZ.svg?url';
import Logo3AZ from '/assets/3AZ.svg?url';

type TDeploymentModeCardInfos = {
  mode: TDeploymentMode;
  title: string;
  descriptionKey: string;
  medium: {
    src: string;
    altKey: string;
  };
};

const deploymentModesInfo: Array<TDeploymentModeCardInfos> = [
  {
    mode: 'region-3-az',
    title: '3-AZ',
    descriptionKey: 'kubernetes_add_region_description_region-3-az',
    medium: {
      src: Logo3AZ,
      altKey: 'kubernetes_add_region_title_region-3-az_alt',
    },
  },
  {
    mode: 'region',
    title: '1-AZ',
    descriptionKey: 'kubernetes_add_region_description_region',
    medium: {
      src: Logo1AZ,
      altKey: 'kubernetes_add_region_title_region_alt',
    },
  },
];

type TDeploymentModeSelectProps = {
  onDeploymentModeChange?: (value: TCreateClusterSchema['location']['deploymentMode']) => void;
};

export const DeploymentModeSelect = ({ onDeploymentModeChange }: TDeploymentModeSelectProps) => {
  const { t } = useTranslation(['add', 'common']);
  const { control } = useFormContext<TCreateClusterSchema>();

  return (
    <section className="mt-6">
      <Controller<TCreateClusterSchema, 'location.deploymentMode'>
        name="location.deploymentMode"
        control={control}
        render={({ field }) => (
          <RadioGroup
            name="deploymentMode"
            className="grid grid-cols-1 gap-4 lg:grid-cols-2"
            value={field.value}
          >
            {deploymentModesInfo.map(({ mode, title: titleKey, descriptionKey, medium }) => (
              <PciCard
                selectable
                selected={field.value === mode}
                className="h-full"
                key={mode}
                onClick={() => {
                  field.onChange(mode);
                  onDeploymentModeChange?.(mode);
                }}
              >
                <PciCard.Header>
                  <Radio className="w-full" value={mode}>
                    <RadioControl />
                    <RadioLabel>
                      <Text preset="heading-5">{titleKey}</Text>
                    </RadioLabel>
                  </Radio>
                </PciCard.Header>

                <PciCard.Content className="justify-between">
                  <Text>{t(descriptionKey)}</Text>
                  <div className="mt-4 flex justify-center">
                    <Medium alt={t(medium.altKey)} src={medium.src} />
                  </div>
                </PciCard.Content>
              </PciCard>
            ))}
          </RadioGroup>
        )}
      />
    </section>
  );
};
