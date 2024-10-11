import { PageLayout, Title } from '@ovh-ux/manager-react-components';
import { FC, useMemo } from 'react';
import { useHref, useRouteLoaderData } from 'react-router-dom';
import { TProject } from '@ovh-ux/manager-pci-common';
import { useTranslation } from 'react-i18next';
import {
  OsdsDivider,
  OsdsIcon,
  OsdsLink,
} from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components';
import {
  Breadcrumb,
  TBreadcrumbProps,
} from '@/components/breadcrumb/Breadcrumb.component';
import { useHidePreloader } from '@/hooks/hidePreloader/useHidePreloader';
import { ModelStep } from './steps/model/ModelStep.component';
import { RegionStep } from './steps/region/RegionStep.component';

const CreateInstance: FC = () => {
  const project = useRouteLoaderData('root') as TProject;
  const backHref = useHref('..');
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
      <OsdsLink
        className="mt-12 mb-3"
        color={ODS_THEME_COLOR_INTENT.primary}
        href={backHref}
      >
        <OsdsIcon
          className="mr-2"
          name={ODS_ICON_NAME.ARROW_LEFT}
          size={ODS_ICON_SIZE.xs}
          color={ODS_THEME_COLOR_INTENT.primary}
          slot="start"
        />
        {t('pci_instances_common_go_back')}
      </OsdsLink>
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
