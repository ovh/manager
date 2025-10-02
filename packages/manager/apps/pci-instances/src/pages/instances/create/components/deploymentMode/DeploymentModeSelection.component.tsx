import { useTranslation } from 'react-i18next';
import {
  Checkbox,
  CheckboxControl,
  CheckboxGroup,
  CheckboxLabel,
  Link,
  Text,
} from '@ovhcloud/ods-react';
import { Controller, useFormContext } from 'react-hook-form';
import { PciCard } from '@/components/pciCard/PciCard.component';
import { DeploymentModeBadge } from '@/components/deploymentModeBadge/DeploymentModeBadge.component';
import { deploymentModes } from '@/__mocks__/instance/constants';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { HelpDrawer } from '@/components/helpDrawer/HelpDrawer.component';
import { TDeploymentMode } from '@/types/instance/common.type';
import { useGuideLink } from '@/hooks/url/useGuideLink';

export const deploymentModesDefaultValue: string[] = ['3AZ', '1AZ'];

type TDeploymentModeSelection = {
  deploymentModes: TDeploymentMode[];
};

export const DeploymentModeSelection = () => {
  const { t } = useTranslation([NAMESPACES.ONBOARDING, 'creation', 'common']);
  const { control } = useFormContext<TDeploymentModeSelection>();
  const guide = useGuideLink('LOCATION');

  return (
    <section className="my-8">
      <div className="flex flex-col gap-4">
        <div className="mt-8 flex items-center space-x-4">
          <Text preset="heading-3">
            {t('creation:pci_instance_creation_select_deployment_mode_title')}
          </Text>
          <HelpDrawer>
            <Text preset="paragraph" className="mb-4">
              {t(
                'creation:pci_instance_creation_select_deployment_mode_help_p1',
              )}
            </Text>
            <Text preset="paragraph" className="mb-4">
              {t(
                'creation:pci_instance_creation_select_deployment_mode_help_p2',
              )}
            </Text>
            <Text preset="paragraph" className="mb-4">
              {t(
                'creation:pci_instance_creation_select_deployment_mode_help_p3',
              )}
            </Text>
            <Text preset="paragraph" className="mb-4">
              {t(
                'creation:pci_instance_creation_select_deployment_mode_help_p4',
              )}
            </Text>
            <Link
              className="visited:text-[var(--ods-color-primary-500)]"
              href={guide}
              target="_blank"
            >
              {t('find_out_more')}
            </Link>
          </HelpDrawer>
        </div>

        <Text preset="paragraph">
          (Not mandatory) Si besoin d’un texte explicatif/consigne...
        </Text>
      </div>
      <section className="mt-6">
        <Controller<TDeploymentModeSelection, 'deploymentModes'>
          name="deploymentModes"
          control={control}
          render={({ field }) => (
            <CheckboxGroup
              name="deploymentModes"
              className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4"
              defaultValue={field.value}
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
                    const currentValue = field.value;
                    if (currentValue.includes(mode.id)) {
                      field.onChange(
                        currentValue.filter(
                          (value: TDeploymentMode) => value !== mode.id,
                        ),
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
                    <DeploymentModeBadge mode={mode.id} />
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
