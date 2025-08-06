import { FC } from 'react';
import { useRouteLoaderData } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TProject } from '@ovh-ux/manager-pci-common';
import { FormField, FormFieldLabel, Input, Text } from '@ovhcloud/ods-react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { Breadcrumb } from '@/components/breadcrumb/Breadcrumb.component';
import { Cart } from '@/components/cart/Cart';
import { instanceNameRegex } from '@/constants';

export type TInstanceCreationForm = z.infer<typeof instanceCreationSchema>;
export const instanceCreationSchema = z.object({
  name: z.string().regex(instanceNameRegex),
});

const CreateInstance: FC = () => {
  const project = useRouteLoaderData('root') as TProject | undefined;
  const { t } = useTranslation(['common', 'creation']);

  const formMethods = useForm({
    resolver: zodResolver(instanceCreationSchema),
    defaultValues: {
      name: 'default name to add',
    },
    mode: 'onChange',
  });

  const {
    formState: { errors },
    register,
  } = formMethods;

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
            <section className="mb-9">
              <Text preset="heading-1">
                {t('common:pci_instances_common_create_instance')}
              </Text>
              <Text preset="paragraph">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. (Not
                mandatory) Si besoin d’un texte d’introduction... .
              </Text>
            </section>
            <section className="w-1/2">
              {/* TODO: Pre-fill name with combination of {flavor_name region_id month day hour minute} */}
              <div className="pt-3 pb-4">
                <FormField>
                  <FormFieldLabel>
                    {t('common:pci_instances_common_instance_name')}
                  </FormFieldLabel>
                  <Input
                    {...register('name')}
                    invalid={!!errors.name}
                    className="w-full"
                  />
                </FormField>
              </div>
              <Text
                className={clsx('text-sm', {
                  'text-[--ods-color-critical-500]': !!errors.name,
                })}
                preset="span"
              >
                {t('creation:pci_instance_creation_name_rule')}
              </Text>
            </section>
          </section>
          <aside className="min-w-[320px] w-full max-w-[640px]">
            <Cart />
          </aside>
        </div>
      </FormProvider>
    </main>
  );
};

export default CreateInstance;
