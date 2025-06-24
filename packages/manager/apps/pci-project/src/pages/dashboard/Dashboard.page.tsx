import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { OdsSkeleton, OdsText, OdsBadge } from '@ovhcloud/ods-components/react';
import { Title } from '@ovh-ux/manager-react-components';
import { useProject } from '@/hooks/useProject';
import { Breadcrumb, BreadcrumbItem } from '@/components/Breadcrumb';
import RoadmapChangelogButton from './RoadmapChangelogButton';

export default function Dashboard() {
  const { t } = useTranslation('dashboard');
  const { resourceName } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!resourceName) navigate('/');
  }, [resourceName, navigate]);

  if (!resourceName) return null;

  const { project, isLoading, isError } = useProject(resourceName);

  if (isLoading) return <OdsSkeleton />;

  if (isError) return <OdsText>{t('error')}</OdsText>;

  if (!project) return <OdsText>{t('project_not_found')}</OdsText>;

  const projectName = project.projectName ?? resourceName;

  const breadcrumbActualItem: BreadcrumbItem = {
    label: projectName,
    href: '#',
  };

  return (
    <>
      <Breadcrumb items={[breadcrumbActualItem]} />
      <div className="flex items-center justify-between w-full mt-5 -mb-9">
        <div className="flex items-center gap-4 -mt-3">
          <Title className="">{projectName}</Title>
          <OdsBadge className="mb-7" label={t('dashboard_discovery_mode')} />
        </div>
        <RoadmapChangelogButton />
      </div>

      {project.description && (
        <p className="text-sm text-gray-500">{project.description}</p>
      )}
    </>
  );
}
