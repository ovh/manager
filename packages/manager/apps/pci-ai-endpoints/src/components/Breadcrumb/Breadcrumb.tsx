import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { OsdsBreadcrumb } from '@ovhcloud/ods-components/react';
import { useProjectUrl } from '@ovh-ux/manager-react-components';
import { useProject } from '@ovh-ux/manager-pci-common';
import { useLocation } from 'react-router-dom';
import { BreadcrumbItem } from '@/hooks/breadcrumb/useBreadcrumb.hook';

export interface BreadcrumbProps {
  customRootLabel?: string;
  appName?: string;
  items?: BreadcrumbItem[];
}

const capitalize = (name: string) => {
  if (!name) return '';
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
};

function Breadcrumb() {
  const hrefProject = useProjectUrl('public-cloud');
  const { t } = useTranslation('metric');
  const { data: project } = useProject();
  const location = useLocation();

  const path = useMemo(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);

    switch (pathSegments[5]) {
      case 'metrics':
        return 'metrics';
      case 'dashboard':
        return 'dashboard';
      default:
        return '';
    }
  }, [location.pathname]);

  return (
    <OsdsBreadcrumb
      items={[
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
          label: capitalize(t(path)),
        },
      ]}
    />
  );
}

export default Breadcrumb;
