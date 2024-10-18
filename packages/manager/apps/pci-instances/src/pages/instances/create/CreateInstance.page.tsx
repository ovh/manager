import { PageLayout, Title } from '@ovh-ux/manager-react-components';
import { FC, useMemo } from 'react';
import { useRouteLoaderData } from 'react-router-dom';
import { TProject } from '@ovh-ux/manager-pci-common';
import { useTranslation } from 'react-i18next';
import { OsdsDivider } from '@ovhcloud/ods-components/react';
import {
  Breadcrumb,
  TBreadcrumbProps,
} from '@/components/breadcrumb/Breadcrumb.component';
import { useHidePreloader } from '@/hooks/hidePreloader/useHidePreloader';
import { ModelStep } from './steps/model/ModelStep.component';
import { RegionStep } from './steps/region/RegionStep.component';
import { GoBack } from '@/components/navigation/GoBack.component';

const CreateInstance: FC = () => {
  const project = useRouteLoaderData('root') as TProject;
  const { t } = useTranslation('common');
  const breadcrumbItems = useMemo<TBreadcrumbProps['items']>(
    () => [
      {
        label: t('pci_instances_common_create_instance'),
      },
    ],
    [t],
  );

  useHidePreloader();

  return (
    <PageLayout>
      {project && (
        <Breadcrumb
          projectLabel={project.description ?? ''}
          items={breadcrumbItems}
        />
      )}
      <GoBack />
      <div className="header mb-6 mt-8">
        <Title>{t('pci_instances_common_create_instance')}</Title>
      </div>
      <OsdsDivider />
      <div className="grid grid-cols-1 gap-4">
        <ModelStep />
        <RegionStep />
      </div>
    </PageLayout>
  );
};

export default CreateInstance;
