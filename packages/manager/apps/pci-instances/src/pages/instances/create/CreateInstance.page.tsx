import { FC } from 'react';
import { useRouteLoaderData } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TProject } from '@ovh-ux/manager-pci-common';
import { Spinner } from '@ovhcloud/ods-react';
import { Breadcrumb } from '@/components/breadcrumb/Breadcrumb.component';
import { useInstancesCatalog } from '@/data/hooks/catalog/useInstancesCatalog';
import { CreateInstanceForm } from './components/createInstanceForm/CreateInstanceForm.component';

const CreateInstance: FC = () => {
  const project = useRouteLoaderData('root') as TProject | undefined;
  const { t } = useTranslation('common');

  const { isLoading } = useInstancesCatalog();

  const breadcrumbItems = [
    {
      label: t('common:pci_instances_common_create_instance'),
    },
  ];

  return (
    <main className="mt-8 px-4 py-8 md:mt-2 md:px-10 md:py-9">
      <section className="mb-8">
        {project && (
          <Breadcrumb
            projectLabel={project.description ?? ''}
            items={breadcrumbItems}
          />
        )}
      </section>
      {isLoading ? <Spinner /> : <CreateInstanceForm />}
    </main>
  );
};

export default CreateInstance;
