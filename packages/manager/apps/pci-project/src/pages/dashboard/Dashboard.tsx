import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { OdsSkeleton, OdsText, OdsBadge } from '@ovhcloud/ods-components/react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProject } from '@/hooks/useProject';
import { Breadcrumb, BreadcrumbItem } from '@/components/Breadcrumb';

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

  const projectName = project?.projectName ?? resourceName;

  const breadcrumbActualItem: BreadcrumbItem = {
    label: projectName,
    href: '#',
  };

  return (
    <>
      <Breadcrumb items={[breadcrumbActualItem]} />
      <h1>{projectName}</h1>

      <OdsBadge label={t('dashboard_discovery_mode')} />

      {project?.description && (
        <p className="text-sm text-gray-500">{project?.description}</p>
      )}
    </>
  );
}
