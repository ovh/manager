import { ArrowRight, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@datatr-ux/uxlib';
import ai from '@/types/AI';
import OvhLink from '@/components/links/OvhLink.component';
import { getColumns } from './_components/DockerTableColumns.component';
import DataTable from '@/components/data-table';
import { useUserActivityContext } from '@/contexts/UserActivityContext';
import { POLLING } from '@/configuration/polling.constants';
import { useGetRegistries } from '@/data/hooks/ai/registry/useGetRegistries.hook';

const PrivateDocker = () => {
  const { t } = useTranslation('ai-tools/dashboard/docker');
  const { projectId } = useParams();
  const navigate = useNavigate();
  const privateRegistriesPath = `#/pci/projects/${projectId}/private-registry`;
  const { isUserActive } = useUserActivityContext();
  const dockerQuery = useGetRegistries(projectId, {
    refetchInterval: isUserActive && POLLING.DOCKER,
  });
  const columns: ColumnDef<ai.registry.Registry>[] = getColumns({
    onDeleteClick: (docker: ai.registry.Registry) =>
      navigate(`./delete/${docker.id}`),
  });

  return (
    <>
      <h4>{t('titlePrivateDocker')}</h4>
      <p>{t('privateDockerParagraphe1')}</p>
      <p>{t('privateDockerParagraphe2')}</p>

      <OvhLink
        data-testid="managed-private-registries-link"
        application="public-cloud"
        path={privateRegistriesPath}
        target="_blank"
        rel="noopener noreferrer"
      >
        {t('managerPrivateRegistriesButton')}
        <ArrowRight className="size-4 inline ml-1" />
      </OvhLink>

      <p>{t('privateDockerParagraphe3')}</p>

      <Button
        data-testid="create-docker-button"
        className="sm"
        onClick={() => navigate('./add')}
      >
        <Plus className="size-5" />
        {t('addButtonLabel')}
      </Button>

      {dockerQuery.isSuccess ? (
        <DataTable.Provider
          columns={columns}
          data={dockerQuery.data}
          pageSize={25}
        />
      ) : (
        <div data-testid="docker-table-skeleton">
          <DataTable.Skeleton columns={3} rows={5} width={100} height={16} />
        </div>
      )}
      <Outlet />
    </>
  );
};

export default PrivateDocker;
