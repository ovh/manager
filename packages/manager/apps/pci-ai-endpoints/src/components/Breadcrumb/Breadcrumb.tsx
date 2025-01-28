import { useState, useEffect } from 'react';
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

function Breadcrumb() {
  const hrefProject = useProjectUrl('public-cloud');
  const { t } = useTranslation('metric');
  const { data: project } = useProject();
  const location = useLocation();
  const [path, setPath] = useState('');

  useEffect(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);

    // Met à jour l'état `path` en fonction du segment de chemin
    if (pathSegments[5]) {
      switch (pathSegments[5]) {
        case 'metrics':
          setPath('metrics');
          break;
        case 'dashboard':
          setPath('dashboard');
          break;
        default:
          setPath('');
          break;
      }
    }
  }, [location.pathname]); // Dépendance sur `location.pathname` pour exécuter cet effet lorsque le chemin change

  const capitalize = (name: string) => {
    if (!name) return '';
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

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
