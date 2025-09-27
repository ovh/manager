import { useTranslation } from 'react-i18next';
import {
  Button,
  Checkbox,
  CheckboxControl,
  CheckboxGroup,
  CheckboxLabel,
  Drawer,
  DRAWER_POSITION,
  DrawerBody,
  DrawerContent,
  DrawerTrigger,
  Link,
  Text,
} from '@ovhcloud/ods-react';
import z from 'zod';
import { Controller, useFormContext } from 'react-hook-form';
import { PciCard } from '@/components/pciCard/PciCard.component';
import { DeploymentModeBadge } from '@/components/deploymentModeBadge/DeploymentModeBadge.component';
import { TDeploymentMode } from '@/types/instance/common.type';
import { deploymentModes } from '@/__mocks__/instance/constants';
import { deploymentModesDefaultValue } from '@/components/cart/Cart.constants';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';

export const deploymentModesSchema = z.array(z.string());

type TDeploymentModeSelection = {
  deploymentModes: string[];
};

export const DeploymentModeSelection = () => {
  const { t } = useTranslation([NAMESPACES.ONBOARDING, 'creation', 'common']);
  const { control } = useFormContext<TDeploymentModeSelection>();

  return (
    <section className="my-8">
      <div className="flex flex-col gap-4">
        <div className="mt-8 flex items-center space-x-4">
          <Text preset="heading-3">
            {t('creation:pci_instance_creation_select_deployment_mode_title')}
          </Text>
          <div className="w-px bg-[var(--ods-color-information-800)] h-[25px]"></div>
          <div>
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="ghost" size="sm">
                  {t('common:pci_instances_common_help')}
                </Button>
              </DrawerTrigger>
              <DrawerContent position={DRAWER_POSITION.right}>
                <DrawerBody className="pb-10">
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
                    href="https://help.ovhcloud.com/csm/fr-public-cloud-deployments-modes?id=kb_article_view&sysparm_article=KB0066031"
                    target="_blank"
                  >
                    {t('find_out_more')}
                  </Link>
                </DrawerBody>
              </DrawerContent>
            </Drawer>
          </div>
        </div>

        <Text preset="paragraph">
          {t(
            'creation:pci_instance_creation_select_deployment_mode_informations',
          )}
        </Text>
      </div>
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
