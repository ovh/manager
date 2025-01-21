import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import * as ai from '@/types/cloud/project/ai';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import OvhLink from '@/components/links/OvhLink.component';
import { useGetRegistries } from '@/hooks/api/ai/registry/useGetRegistries.hook';
import { POLLING } from '@/configuration/polling';
import { getColumns } from './_components/DockerTableColumns.component';
import { useUserActivityContext } from '@/contexts/UserActivity.context';

const PrivateDocker = () => {
  const { t } = useTranslation('pci-ai-dashboard/docker');
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
      <Button
        data-testid="managed-private-registries-button"
        variant="default"
        type="button"
        size="sm"
        asChild
      >
        <OvhLink
          className="hover:no-underline hover:text-primary-foreground"
          application="public-cloud"
          path={privateRegistriesPath}
        >
          {t('managerPrivateRegistriesButton')}
        </OvhLink>
      </Button>
      <p>{t('privateDockerParagraphe3')}</p>

      <Button
        data-testid="create-docker-button"
        onClick={() => navigate('./add')}
        className="font-semibold"
        variant="outline"
        size="sm"
      >
        <Plus className="w-4 h-4 mr-2" />
        {t('addButtonLabel')}
      </Button>

      {dockerQuery.isSuccess ? (
        <DataTable columns={columns} data={dockerQuery.data} pageSize={25} />
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
