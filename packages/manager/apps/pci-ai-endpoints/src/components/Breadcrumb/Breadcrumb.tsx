import { useTranslation } from 'react-i18next';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@ovhcloud/ods-react';
import { useProjectUrl } from '@ovh-ux/manager-react-components';
import { useProject } from '@ovh-ux/manager-pci-common';
import { useLocation } from 'react-router-dom';
import { useMemo } from 'react';

const capitalize = (name: string) => {
  return name.charAt(0).toUpperCase() + name.slice(1);
};

function BreadcrumbComponent() {
  const hrefProject = useProjectUrl('public-cloud');
  const { t } = useTranslation(['metric', 'token']);

  const { data: project } = useProject();
  const location = useLocation();

  const page = useMemo(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const section = pathSegments.find((segment) =>
      ['metrics', 'token'].includes(segment),
    );

    switch (section) {
      case 'metrics':
        return t('metric:ai_endpoints_metrics');
      case 'token':
        return t('token:ai_endpoints_token');
      default:
        return '';
    }
  }, [location.pathname, t]);

  const breadcrumbItems = [
    {
      href: hrefProject,
      label: project?.description || 'Project',
    },
    {
      label: 'AI Endpoints',
      disabled: true,
    },
    {
      href: hrefProject,
      label: capitalize(page || ''),
    },
  ];

  return (
    <Breadcrumb aria-label="Breadcrumb">
      {breadcrumbItems.map((item, index) => {
        const isLast = index === breadcrumbItems.length - 1;
        const linkProps: {
          href?: string;
          'aria-current'?: 'page';
          'aria-disabled'?: true;
        } = {};

        if (isLast) {
          linkProps['aria-current'] = 'page';
        } else if (item.disabled || !item.href) {
          linkProps['aria-disabled'] = true;
        } else {
          linkProps.href = item.href;
        }

        return (
          <BreadcrumbItem key={`${item.label}-${index}`}>
            <BreadcrumbLink {...linkProps}>{item.label}</BreadcrumbLink>
          </BreadcrumbItem>
        );
      })}
    </Breadcrumb>
  );
}

export default BreadcrumbComponent;
