import { FC } from 'react';
import { useRouteLoaderData } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TProject } from '@ovh-ux/manager-pci-common';
import { Text } from '@ovhcloud/ods-react';
import { Breadcrumb } from '@/components/breadcrumb/Breadcrumb.component';
import { Cart } from '@/components/cart/Cart';

const CreateInstance: FC = () => {
  const project = useRouteLoaderData('root') as TProject | undefined;
  const { t } = useTranslation('common');

  const breadcrumbItems = [
    { label: t('pci_instances_common_create_instance') },
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
      <div className="flex gap-6">
        <section className="w-2/3">
          <section className="mb-9">
            <Text preset="heading-1">
              {t('pci_instances_common_create_instance')}
            </Text>
            <Text preset="paragraph">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. (Not
              mandatory) Si besoin d’un texte d’introduction... .
            </Text>
          </section>
        </section>
        <aside className="min-w-[320px] w-full max-w-[640px]">
          <Cart />
        </aside>
      </div>
    </main>
  );
};

export default CreateInstance;
