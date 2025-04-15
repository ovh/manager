import { useTranslation } from 'react-i18next';
import { OsdsBreadcrumb } from '@ovhcloud/ods-components/react';
import { useProjectUrl } from '@ovh-ux/manager-react-components';
import { useProject } from '@ovh-ux/manager-pci-common';
import { useLocation } from 'react-router-dom';
import { useMemo } from 'react';
import { BreadcrumbItem } from '@/hooks/breadcrumb/useBreadcrumb.hook';

export interface BreadcrumbProps {
  customRootLabel?: string;
  appName?: string;
  items?: BreadcrumbItem[];
}

const capitalize = (name: string) => {
  return name.charAt(0).toUpperCase() + name.slice(1);
};

function Breadcrumb() {
  const hrefProject = useProjectUrl('public-cloud');
  const { t } = useTranslation('metric');
  const { data: project } = useProject();
  const location = useLocation();

  const page = useMemo(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    if (pathSegments.includes('metrics')) {
      return 'ai_endpoints_metrics';
    }
    return '';
  }, [location.pathname]);

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
      label: capitalize(t(page) || ''),
    },
  ];

  return (
    <OsdsBreadcrumb
      items={breadcrumbItems.map((item) => ({
        label: item.label,
        href: item.href,
        disabled: item.disabled,
      }))}
    />
  );
}

export default Breadcrumb;
