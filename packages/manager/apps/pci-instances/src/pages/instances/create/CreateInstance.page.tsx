import {
  PageLayout,
  StepComponent,
  Title,
} from '@ovh-ux/manager-react-components';
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

const CreateInstance: FC = () => {
  const project = useRouteLoaderData('root') as TProject;
  const { t } = useTranslation(['create', 'common']);
  const breadcrumbItems = useMemo<TBreadcrumbProps['items']>(
    () => [
      {
        label: t('common:create_instance'),
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
      <div className="header mb-6 mt-8">
        <Title>{t('common:create_instance')}</Title>
      </div>
      <OsdsDivider />
      <div className="grid grid-cols-1 gap-4">
        <StepComponent
          isOpen
          isChecked={false}
          isLocked
          order={1}
          title={t('select_template')}
        />
      </div>
    </PageLayout>
  );
};

export default CreateInstance;
