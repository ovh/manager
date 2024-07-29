import { ColumnDef } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';
import Guides from '@/components/guides/Guides.component';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { POLLING } from '@/configuration/polling';
import { useGetRegions } from '@/hooks/api/ai/capabilities/useGetRegions.hook';
import {
  DataStoresWithRegion,
  useGetDatastoresWithRegions,
} from '@/hooks/api/ai/datastore/useGetDatastoresWithRegions.hook';
import * as ai from '@/types/cloud/project/ai';
import { useModale } from '@/hooks/useModale.hook';
import { getColumns } from './_components/GitTableColumns.component';
import AddGit from './_components/AddGit.component';
import DeleteGit from './_components/DeleteGit.component';
import { GuideSections } from '@/configuration/guide';

export function breadcrumb() {
  return (
    <BreadcrumbItem
      translationKey="breadcrumb"
      namespace="pci-ai-dashboard/git"
    />
  );
}

const Git = () => {
  const { t } = useTranslation('pci-ai-dashboard/git');
  const { projectId } = useParams();
  const [regions, setRegions] = useState<ai.capabilities.Region[]>([]);
  const regionQuery = useGetRegions(projectId);
  const datastoreQuery = useGetDatastoresWithRegions(projectId, regions, {
    refetchInterval: POLLING.DATASTORE,
  });
  const addModale = useModale('add');
  const deleteModale = useModale('delete');

  const columns: ColumnDef<DataStoresWithRegion>[] = getColumns({
    onDeleteClick: (git: DataStoresWithRegion) => deleteModale.open(git.alias),
  });

  useEffect(() => {
    if (!regionQuery.data) return;
    setRegions(regionQuery.data);
  }, [regionQuery.isSuccess]);

  const gitToDelete: DataStoresWithRegion = datastoreQuery.data?.find(
    (ds) => ds.alias === deleteModale.value,
  );

  return (
    <>
      <div className="float-right">
        <Guides section={GuideSections.datastore} />
      </div>
      <h3>{t('title')}</h3>
      <p>{t('gitParagraphe2')}</p>
      <p>{t('gitParagraphe3')}</p>
      <Button
        data-testid="create-git-button"
        onClick={() => addModale.open()}
        className="font-semibold"
        variant="outline"
        size="sm"
      >
        <Plus className="w-4 h-4 mr-2" />
        {t('addButtonLabel')}
      </Button>

      <DataTable
        columns={columns}
        data={datastoreQuery.data?.filter(
          (ds) => ds.type === ai.DataStoreTypeEnum.git,
        )}
        pageSize={25}
      />
      {regionQuery.isSuccess && (
        <AddGit
          regions={regionQuery.data}
          controller={addModale.controller}
          onSuccess={() => {
            addModale.close();
            datastoreQuery.refetchAll();
          }}
        />
      )}
      {gitToDelete && (
        <DeleteGit
          git={gitToDelete}
          controller={deleteModale.controller}
          onSuccess={() => {
            deleteModale.close();
            datastoreQuery.refetchAll();
          }}
        />
      )}
    </>
  );
};

export default Git;
