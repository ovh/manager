import { ColumnDef } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';
import Guides from '@/components/guides/Guides.component';
import { Button } from '@/components/ui/button';
import { useGetRegions } from '@/hooks/api/ai/capabilities/useGetRegions.hook';
import {
  DataStoresWithRegion,
  useGetDatastoresWithRegions,
} from '@/hooks/api/ai/datastore/useGetDatastoresWithRegions.hook';
import * as ai from '@/types/cloud/project/ai';
import { getColumns } from './_components/GitTableColumns.component';
import DataTable from '@/components/data-table';
import { useUserActivityContext } from '@/contexts/UserActivityContext';
import { POLLING } from '@/configuration/polling.constants';

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
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [regions, setRegions] = useState<ai.capabilities.Region[]>([]);
  const regionQuery = useGetRegions(projectId);
  const { isUserActive } = useUserActivityContext();
  const datastoreQuery = useGetDatastoresWithRegions(projectId, regions, {
    refetchInterval: isUserActive && POLLING.DATASTORE,
  });
  const columns: ColumnDef<DataStoresWithRegion>[] = getColumns({
    onDeleteClick: (git: DataStoresWithRegion) =>
      navigate(`./delete/${git.region}/${git.alias}`),
  });

  useEffect(() => {
    if (!regionQuery.data) return;
    setRegions(regionQuery.data);
  }, [regionQuery.isSuccess]);

  return (
    <>
      <div className="float-right">
        <Guides />
      </div>
      <h3>{t('title')}</h3>
      <p>{t('gitParagraphe2')}</p>
      <p>{t('gitParagraphe3')}</p>
      <Button
        data-testid="create-git-button"
        onClick={() => navigate('./add')}
        className="font-semibold"
        variant="outline"
        size="sm"
      >
        <Plus className="w-4 h-4 mr-2" />
        {t('addButtonLabel')}
      </Button>

      <DataTable.Provider
        columns={columns}
        data={datastoreQuery.data?.filter(
          (ds) => ds.type === ai.DataStoreTypeEnum.git,
        )}
        pageSize={25}
      />
      <Outlet />
    </>
  );
};

export default Git;
