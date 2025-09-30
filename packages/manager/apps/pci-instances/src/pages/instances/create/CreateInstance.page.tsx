import { FC } from 'react';
import { useRouteLoaderData } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TProject } from '@ovh-ux/manager-pci-common';
import { Divider, Text } from '@ovhcloud/ods-react';
import { FormProvider } from 'react-hook-form';
import { z } from 'zod';
import { Breadcrumb } from '@/components/breadcrumb/Breadcrumb.component';
import { CreationCart } from './components/CreationCart.component';
import { Name } from '@/pages/instances/create/components/Name.component';
import { LocalizationSelection } from '@/pages/instances/create/components/localisationSelection/LocalizationSelection.component';
import { Localization } from '@/pages/instances/create/components/Localization.component';
import { AdvancedParameters } from '@/pages/instances/create/components/AdvancedParameters.component';
import { QuantitySelector } from '@/pages/instances/create/components/QuantitySelector.component';
import { DeploymentModeSelection } from '@/pages/instances/create/components/deploymentMode/DeploymentModeSelection.component';
import { PciCardShowcaseComponent } from '@/components/pciCard/PciCardShowcase.component';
import {
  continentSelectionSchema,
  deploymentModesSchema,
  flavorCategorySchema,
  flavorTypeSchema,
  localizationSelectionSchema,
  nameSchema,
  quantitySchema,
} from '@/pages/instances/create/CreateInstance.schema';

import { useInstancesCatalog } from '@/data/hooks/catalog/useInstancesCatalog';
import FlavorBlock from './components/FlavorBlock.component';
import { useForm } from './hooks/useForm';
import { useProjectId } from '@/hooks/project/useProjectId';

export type TInstanceCreationForm = z.infer<typeof instanceCreationSchema>;
export const instanceCreationSchema = z.object({
  name: nameSchema,
  quantity: quantitySchema,
  deploymentModes: deploymentModesSchema,
  region: localizationSelectionSchema,
  continent: continentSelectionSchema,
  flavorCategory: flavorCategorySchema,
  flavorType: flavorTypeSchema,
});

const quantityHintParams = {
  quota: 1,
  type: 'type',
  region: 'region',
};

const CreateInstance: FC = () => {
  const project = useRouteLoaderData('root') as TProject | undefined;
  const projectId = useProjectId();
  const { t } = useTranslation(['common', 'creation']);

  useInstancesCatalog();

  const formMethods = useForm(projectId);

  const breadcrumbItems = [
    {
      label: t('common:pci_instances_common_create_instance'),
    },
  ];

  return (
    <main className="py-8 px-4 mt-8 md:py-9 md:px-10 md:mt-2">
      <section className="mb-8">
        {project && (
          <Breadcrumb
            projectLabel={project.description ?? ''}
            items={breadcrumbItems}
          />
        )}
      </section>
      <FormProvider {...formMethods}>
        <div className="flex gap-6">
          <section className="w-2/3">
            <article className="mb-9">
              <Text preset="heading-1">
                {t('common:pci_instances_common_create_instance')}
              </Text>
              <Text preset="paragraph">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. (Not
                mandatory) Si besoin d’un texte d’introduction... .
              </Text>
            </article>
            <Name />
            <Localization />
            <DeploymentModeSelection />
            <LocalizationSelection />

            <AdvancedParameters />
            <QuantitySelector
              quota={quantityHintParams.quota}
              type={quantityHintParams.type}
              region={quantityHintParams.region}
            />
            <Divider spacing="64" />
            <FlavorBlock />
            <PciCardShowcaseComponent />
          </section>
          <aside className="min-w-[280px] w-1/3 max-w-[640px]">
            <CreationCart />
          </aside>
        </div>
      </FormProvider>
    </main>
  );
};

export default CreateInstance;
