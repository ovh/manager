import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import * as ai from '@/types/cloud/project/ai';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import OvhLink from '@/components/links/OvhLink.component';
import { useGetRegistries } from '@/hooks/api/ai/registry/useGetRegistries.hook';
import { POLLING } from '@/configuration/polling';
import { useModale } from '@/hooks/useModale.hook';
import { getColumns } from './_components/DockerTableColumns.component';
import AddDocker from './_components/AddDocker.component';
import DeleteDocker from './_components/DeleteDocker.component';
import { useGetRegions } from '@/hooks/api/ai/capabilities/useGetRegions.hook';

const PrivateDocker = () => {
  const { t } = useTranslation('pci-ai-dashboard/docker');
  const { projectId } = useParams();
  const privateRegistriesPath = `#/pci/project/${projectId}/private-registry`;
  const dockerQuery = useGetRegistries(projectId, {
    refetchInterval: POLLING.DOCKER,
  });
  const regionsQuery = useGetRegions(projectId);
  const addModale = useModale('add');
  const deleteModale = useModale('delete');
  const columns: ColumnDef<ai.registry.Registry>[] = getColumns({
    onDeleteClick: (docker: ai.registry.Registry) =>
      deleteModale.open(docker.id),
  });

  const dockerToDelete = dockerQuery.data?.find(
    (dk) => dk.id === deleteModale.value,
  );
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
        onClick={() => addModale.open()}
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

      {regionsQuery.isSuccess && (
        <AddDocker
          regions={regionsQuery.data}
          controller={addModale.controller}
          onSuccess={() => {
            addModale.close();
            dockerQuery.refetch();
          }}
        />
      )}
      {dockerToDelete && (
        <DeleteDocker
          docker={dockerToDelete}
          controller={deleteModale.controller}
          onSuccess={() => {
            deleteModale.close();
            dockerQuery.refetch();
          }}
        />
      )}
    </>
  );
};

export default PrivateDocker;
