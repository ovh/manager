import { useTranslation } from 'react-i18next';
import {
  Checkbox,
  CheckboxControl,
  CheckboxGroup,
  CheckboxLabel,
  Text,
} from '@ovhcloud/ods-react';
import z from 'zod';
import { Controller, useFormContext } from 'react-hook-form';
import { PciCard } from '@/components/pciCard/PciCard.component';
import { DeploymentModeBadge } from '@/components/deploymentModeBadge/DeploymentModeBadge.component';
import { TDeploymentMode } from '@/types/instance/common.type';
import { deploymentModes } from '@/__mocks__/instance/constants';
import { deploymentModesDefaultValue } from '@/components/cart/Cart.constants';

export const deploymentModesSchema = z.array(z.string());

type TDeploymentModeSelection = {
  deploymentModes: string[];
};

export const DeploymentModeSelection = () => {
  const { t } = useTranslation('creation');
  const { control } = useFormContext<TDeploymentModeSelection>();

  return (
    <section className="my-8">
      <Text preset="heading-3">
        {t('pci_instance_creation_select_deployment_mode_title')}
      </Text>
      <Text preset="paragraph">
        (Not mandatory) Si besoin d’un texte explicatif/consigne...
      </Text>
      <section className="mt-6">
        <Controller<TDeploymentModeSelection>
          name="deploymentModes"
          control={control}
          render={({ field }) => (
            <CheckboxGroup
              name="deploymentModes"
              className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4"
              defaultValue={deploymentModesDefaultValue}
              onValueChange={(value) => {
                field.onChange(value);
              }}
            >
              {deploymentModes.map((mode) => (
                <PciCard
                  selectable
                  selected={field.value.includes(mode.id)}
                  className="h-full"
                  key={mode.id}
                  onClick={() => {
                    // type is not correctly infered by Controller :/
                    const currentValue = field.value as string[];
                    if (currentValue.includes(mode.id)) {
                      field.onChange(
                        currentValue.filter((v: string) => v !== mode.id),
                      );
                    } else {
                      field.onChange([...field.value, mode.id]);
                    }
                  }}
                >
                  <PciCard.Header>
                    <Checkbox
                      className="w-full"
                      checked={field.value.includes(mode.id)}
                    >
                      <CheckboxControl />
                      <CheckboxLabel className="font-bold text-lg text-[--ods-color-heading]">
                        {mode.title}
                      </CheckboxLabel>
                    </Checkbox>
                    <DeploymentModeBadge mode={mode.id as TDeploymentMode} />
                  </PciCard.Header>

                  <PciCard.Content className="justify-between">
                    <Text>{mode.description}</Text>
                    <div className="bg-[--ods-color-neutral-100] w-full h-[100px] mt-6" />
                  </PciCard.Content>
                </PciCard>
              ))}
            </CheckboxGroup>
          )}
        />
      </section>
    </section>
  );
};
