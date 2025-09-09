import { FC } from 'react';
import { useRouteLoaderData } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TProject } from '@ovh-ux/manager-pci-common';
import { Text } from '@ovhcloud/ods-react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AdvancedParameters } from '@/pages/instances/create/components/AdvancedParameters';
import {
  Name,
  nameDefaultValue,
  nameSchema,
} from '@/pages/instances/create/components/Name';
import {
  QuantitySelector,
  quantityDefaultValue,
  quantitySchema,
} from '@/pages/instances/create/components/QuantitySelector';
import { Breadcrumb } from '@/components/breadcrumb/Breadcrumb.component';
import {
  localizationDefaultValue,
  LocalizationSelection,
  localizationSelectionSchema,
} from './components/localisationSelection/LocalizationSelection.component';
import { CreationCart } from './components/CreationCart.component';

export type TInstanceCreationForm = z.infer<typeof instanceCreationSchema>;
export const instanceCreationSchema = z.object({
  name: nameSchema,
  quantity: quantitySchema,
  region: localizationSelectionSchema,
});

const quantityHintParams = {
  quota: 1,
  type: 'type',
  region: 'region',
};

const CreateInstance: FC = () => {
  const project = useRouteLoaderData('root') as TProject | undefined;
  const { t } = useTranslation(['common', 'creation']);

  const formMethods = useForm({
    resolver: zodResolver(instanceCreationSchema),
    defaultValues: {
      name: nameDefaultValue,
      quantity: quantityDefaultValue,
      region: localizationDefaultValue,
    },
    mode: 'onChange',
  });

  const breadcrumbItems = [
    {
      label: t('common:pci_instances_common_create_instance'),
    },
  ];

  return (
    <main>
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
            <AdvancedParameters />
            <Name />
            <QuantitySelector
              quota={quantityHintParams.quota}
              type={quantityHintParams.type}
              region={quantityHintParams.region}
            />
            <LocalizationSelection />
          </section>
          <aside className="min-w-[320px] w-full max-w-[640px]">
            <CreationCart />
          </aside>
        </div>
      </FormProvider>
    </main>
  );
};

export default CreateInstance;
