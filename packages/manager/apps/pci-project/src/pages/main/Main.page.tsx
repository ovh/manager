import { useEffect } from 'react';
import {
  useNavigate,
  useParams,
  Outlet,
  useLocation,
  NavLink,
} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  OdsSpinner,
  OdsText,
  OdsBadge,
  OdsTabs,
  OdsTab,
} from '@ovhcloud/ods-components/react';
import { Title } from '@ovh-ux/manager-react-components';
import { useProject } from '@/hooks/useProject';
import { Breadcrumb, BreadcrumbItem } from '@/components/Breadcrumb';
import RoadmapChangelogButton from './RoadmapChangelogButton';
import { urls } from '@/routes/routes.constant';

export default function Main() {
  const { t } = useTranslation(['common', 'dashboard', 'settings']);
  const { resourceName } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!resourceName) navigate('/');
  }, [resourceName, navigate]);

  if (!resourceName) return null;

  const { project, isLoading, isError } = useProject(resourceName);

  if (isLoading) return <OdsSpinner size="lg" />;

  if (isError) return <OdsText>{t('error')}</OdsText>;

  if (!project) return <OdsText>{t('project_not_found')}</OdsText>;

  const projectName = project.projectName ?? resourceName;

  const breadcrumbActualItem: BreadcrumbItem = {
    label: projectName,
    href: '#',
  };

  const tabs = [
    {
      label: t('dashboard:name'),
      path: `${urls.root}/${resourceName}`,
      isActive: location.pathname === `${urls.root}/${resourceName}`,
    },
    {
      label: t('settings:name'),
      path: `${urls.root}/${resourceName}/${urls.settings}`,
      isActive: location.pathname.endsWith(`/${urls.settings}`),
    },
  ];

  return (
    <>
      <Breadcrumb items={[breadcrumbActualItem]} />
      <div className="flex items-center justify-between w-full mt-5 -mb-9">
        <div className="flex items-center gap-4 -mt-3">
          <Title className="">{projectName}</Title>
          <OdsBadge className="mb-7" label={t('common:discovery_mode')} />
        </div>
        <RoadmapChangelogButton />
      </div>

      {project.description && (
        <p className="text-sm text-gray-500">{project.description}</p>
      )}

      <OdsTabs>
        {tabs.map((tab) => (
          <NavLink to={tab.path} key={tab.label} className="no-underline">
            <OdsTab isSelected={location.pathname === tab.path}>
              {tab.label}
            </OdsTab>
          </NavLink>
        ))}
      </OdsTabs>
      <Outlet />
    </>
  );
}
