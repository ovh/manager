import { PageLayout } from '@ovh-ux/manager-react-components';
import { FC } from 'react';
import { useRouteLoaderData } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TProject } from '@ovh-ux/manager-pci-common';
import { Breadcrumb } from '@/components/breadcrumb/Breadcrumb.component';

const CreateInstance: FC = () => {
  const project = useRouteLoaderData('root') as TProject | undefined;
  const { t } = useTranslation('common');

  const breadcrumbItems = [
    { label: t('pci_instances_common_create_instance') },
  ];

  return (
    <PageLayout>
      {project && (
        <Breadcrumb
          projectLabel={project.description ?? ''}
          items={breadcrumbItems}
        />
      )}
    </PageLayout>
  );
};

export default CreateInstance;
